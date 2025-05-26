// src/modules/case/presentation/services/cases.service.ts
import { Prisma, actor_type, service_type } from "@prisma/client";
import { CasesRepository } from "../../data/repository/cases.repository";
import { NotificationService } from "../../../notification/presentation/services/notification.service";

import type {
  CreateCaseDto,
  UpdateCaseDto,
  ChangeCaseStatusDto,
  CreateCaseAttachmentDto,
  CreateExternalClientDto,
  CreateCaseMessageDto,
} from "../../domain/dtos/index";

import { AppError } from "../../../../utils/errors";
import { HttpStatusCodes } from "../../../../constants/http_status_codes";
import { MESSAGES } from "../../../../constants/messages";
import { getSignedUrl } from "../../../../infrastructure/aws";
import { io } from "../../../../config/socket";

type CurrentUser = { id: number; role: "client" | "lawyer" };

export class CasesService {
  private readonly MAX_OPEN_CLIENT = 5;
  private readonly MAX_INPROGRESS_LAWYER =
    Number(process.env.MAX_LAWYER_CASES) || 10;

  private OPEN_STATUS_ID!: number;

  constructor(
    private readonly casesRepo = new CasesRepository(),
    private readonly notificationService: NotificationService
  ) {}
  async init() {
    this.OPEN_STATUS_ID = await this.casesRepo.getOpenStatusId();
  }

  /* ───────────── LOOK-UPS ───────────── */
  async getCategories() {
    return this.casesRepo.getAllCategories();
  }

  async getStatuses() {
    return this.casesRepo.getAllStatuses();
  }

  /* ───────────── CREATE ───────────── */
  async createCase(
    dto: CreateCaseDto,
    user: { id: number; role: "client" | "lawyer" }
  ) {
    const statuses = await this.casesRepo.getAllStatuses();
    if (statuses.length < 4) {
      throw new AppError(
        "Debe haber al menos 4 estados configurados.",
        HttpStatusCodes.INTERNAL_SERVER_ERROR.code
      );
    }
    const initialStatus = statuses[0].id;
    const takenStatus = statuses[1].id;

    if (user.role === "client") {
      const openCount = await this.casesRepo
        .exploreCases({ status_id: initialStatus, is_public: true })
        .then((r) => r.length);
      if (openCount >= this.MAX_OPEN_CLIENT) {
        throw new AppError(
          MESSAGES.CASE.LIMIT_OPEN_CLIENT,
          HttpStatusCodes.CONFLICT.code
        );
      }
    }

    let isPublic = dto.is_public ?? true;
    let lawyerId: number | null | undefined;
    if (user.role === "client" && dto.selected_lawyer_id) {
      isPublic = false;
      lawyerId = dto.selected_lawyer_id;
    }
    if (user.role === "lawyer") {
      isPublic = dto.is_public ?? false;
      if (!isPublic) lawyerId = user.id;
    }
    if (dto.external_client_id && !lawyerId) {
      const ext = await this.casesRepo.findExternalClientById(
        dto.external_client_id
      );
      lawyerId = ext?.user_detail_id ?? null;
    }

    const serviceId =
      dto.service_id ??
      (
        await this.casesRepo.createService({
          type: service_type.case,
          lawyer: lawyerId ? { connect: { user_id: lawyerId } } : undefined,
          client:
            user.role === "client"
              ? { connect: { user_id: user.id } }
              : undefined,
          external_client: dto.external_client_id
            ? { connect: { id: dto.external_client_id } }
            : undefined,
        })
      ).id;

    const statusIdToUse =
      lawyerId || user.role === "lawyer" ? takenStatus : initialStatus;

    const created = await this.casesRepo.createCase({
      service: { connect: { id: serviceId } },
      title: dto.title,
      description: dto.description,
      category: { connect: { id: dto.category_id } },
      urgency: dto.urgency ?? "media",
      status: { connect: { id: dto.status_id ?? statusIdToUse } },
      is_public: isPublic,
      reference_code: dto.reference_code,
    });

    await this.notificationService.createNotification({
      title: MESSAGES.CASE.CREATED_TITLE,
      description: `Case “${created.title}” created`,
      type: "info",
      receiverId: user.id,
      senderId: user.id,
      url: `/case/${created.id}`,
    });
    io.to(`user:${user.id}`).emit("CASE_CREATED", {
      id: created.id,
      title: created.title,
    });

    return created;
  }

  /* ───────────── READ ───────────── */

  async getCaseById(id: number, user: CurrentUser) {
    const found = await this.casesRepo.findCaseById(id);
    if (!found) {
      throw new AppError(
        MESSAGES.CASE.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );
    }

    const clientId = found.service?.client_id ?? null;
    const lawyerId = found.service?.lawyer_id ?? null;

    if (user.role === "client" && clientId !== user.id) {
      throw new AppError(
        MESSAGES.CASE.ACCESS_DENIED,
        HttpStatusCodes.FORBIDDEN.code
      );
    }

    if (user.role === "lawyer") {
      const assigned = lawyerId === user.id;
      if (!assigned) {
        throw new AppError(
          MESSAGES.CASE.NOT_ASSIGNED_TO_LAWYER,
          HttpStatusCodes.FORBIDDEN.code
        );
      }
    }

    return found;
  }

  async exploreCases(filters: Parameters<CasesRepository["exploreCases"]>[0]) {
    return this.casesRepo.exploreCases(filters);
  }

  async getMyCases(user: { id: number; role: "client" | "lawyer" }) {
    return this.casesRepo.findCasesByUser(user.id, user.role);
  }

  /* ───────────── UPDATE ───────────── */
  async updateCase(
    id: number,
    dto: UpdateCaseDto,
    user: { id: number; role: "client" | "lawyer" }
  ) {
    const found = await this.casesRepo.findCaseById(id);
    if (!found) {
      throw new AppError(
        MESSAGES.CASE.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );
    }

    const clientId = found.service?.client_id ?? null;
    const lawyerId = found.service?.lawyer_id ?? null;

    if (
      (user.role === "client" && clientId !== user.id) ||
      (user.role === "lawyer" && lawyerId !== user.id)
    ) {
      throw new AppError(
        MESSAGES.CASE.ACCESS_DENIED,
        HttpStatusCodes.FORBIDDEN.code
      );
    }

    const data: Prisma.CasesUpdateInput = {
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.category_id !== undefined && { category_id: dto.category_id }),
      ...(dto.urgency !== undefined && { urgency: dto.urgency }),
      ...(dto.is_public !== undefined && { is_public: dto.is_public }),
      ...(dto.reference_code !== undefined && {
        reference_code: dto.reference_code,
      }),
    };

    return this.casesRepo.updateCase(id, data);
  }
  /* ───────────── STATUS ───────────── */
  async changeStatus(
    id: number,
    dto: ChangeCaseStatusDto,
    user: { id: number; role: "client" | "lawyer" }
  ) {
    const found = await this.casesRepo.findCaseById(id);
    if (!found) {
      throw new AppError(
        MESSAGES.CASE.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );
    }

    const currentId = found.status_id;
    const nextId = dto.status_id;
    const clientId = found.service?.client_id ?? null;
    const lawyerId = found.service?.lawyer_id ?? null;

    const statuses = await this.casesRepo.getAllStatuses();
    if (statuses.length < 4) {
      throw new AppError(
        "Debe haber al menos 4 estados configurados.",
        HttpStatusCodes.INTERNAL_SERVER_ERROR.code
      );
    }
    const initialId = statuses[0].id; // estado “creado”
    const takenId = statuses[1].id; // estado “tomado”
    const penultimateId = statuses[statuses.length - 2].id; // estado “cerrar caso”
    const finalId = statuses[statuses.length - 1].id; // estado “archivado”
    const inProgressIds = statuses
      .slice(1, statuses.length - 2)
      .map((s) => s.id); // intermedios

    if (nextId <= currentId) {
      throw new AppError(
        MESSAGES.CASE.INVALID_STATUS,
        HttpStatusCodes.CONFLICT.code
      );
    }

    if (user.role === "lawyer" && currentId === initialId && !lawyerId) {
      await this.casesRepo.assignLawyerToService(found.service_id, user.id);
    }

    if (
      user.role === "lawyer" &&
      (nextId === penultimateId || nextId === finalId) &&
      lawyerId !== user.id
    ) {
      throw new AppError(
        nextId === penultimateId
          ? MESSAGES.CASE.CLOSE_ONLY_LAWYER
          : MESSAGES.CASE.ACCESS_DENIED,
        HttpStatusCodes.FORBIDDEN.code
      );
    }

    if (user.role === "lawyer" && inProgressIds.includes(nextId)) {
      const running = await this.casesRepo.countCasesByLawyer({
        lawyerId: user.id,
        status_id: nextId,
      });
      if (running >= this.MAX_INPROGRESS_LAWYER) {
        throw new AppError(
          MESSAGES.CASE.LIMIT_INPROGRESS_LAWYER,
          HttpStatusCodes.CONFLICT.code
        );
      }
    }

    const updated = await this.casesRepo.changeStatus(id, nextId, user.id);

    if (user.role === "lawyer" && nextId === takenId && clientId) {
      await this.notificationService.createNotification({
        title: MESSAGES.CASE.TAKEN_TITLE,
        description: `Your case “${found.title}” was taken by a lawyer`,
        type: "info",
        receiverId: clientId,
        senderId: user.id,
        url: `/case/${id}`,
      });
      io.to(`user:${clientId}`).emit("CASE_TAKEN", { id });
    }

    return updated;
  }

  /* ───────────── ARCHIVE ───────────── */
  async archiveCase(
    id: number,
    user: { id: number; role: "client" | "lawyer" }
  ) {
    const found = await this.casesRepo.findCaseById(id);
    if (!found) {
      throw new AppError(
        MESSAGES.CASE.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );
    }

    const clientId = found.service?.client_id ?? null;
    const lawyerId = found.service?.lawyer_id ?? null;

    if (
      (user.role === "client" && clientId !== user.id) ||
      (user.role === "lawyer" && lawyerId !== user.id)
    ) {
      throw new AppError(
        MESSAGES.CASE.ACCESS_DENIED,
        HttpStatusCodes.FORBIDDEN.code
      );
    }

    return this.casesRepo.archiveCase(id, user.id);
  }

  /* ───────────── ATTACHMENTS ───────────── */
  async addAttachment(
    caseId: number,
    dto: CreateCaseAttachmentDto,
    user: { id: number; role: "client" | "lawyer" }
  ) {
    const found = await this.casesRepo.findCaseById(caseId);
    if (!found) {
      throw new AppError(
        MESSAGES.CASE.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );
    }

    const clientId = found.service?.client_id ?? null;
    const lawyerId = found.service?.lawyer_id ?? null;

    const isOwner = clientId === user.id || lawyerId === user.id;
    if (!isOwner) {
      throw new AppError(
        MESSAGES.CASE.ACCESS_DENIED,
        HttpStatusCodes.FORBIDDEN.code
      );
    }

    const receiverId = user.role === "client" ? lawyerId : clientId;
    if (!receiverId) {
      throw new AppError(
        "No se puede notificar porque el caso aún no tiene contraparte asignada.",
        HttpStatusCodes.BAD_REQUEST.code
      );
    }

    try {
      const created = await this.casesRepo.addAttachment({
        service: { connect: { id: found.service_id } },
        category: { connect: { id: dto.category_id } },
        file_key: dto.file_key,
        label: dto.label,
        description: dto.description,
        uploaded_by: user.role as actor_type,
        archived: false,
      });

      await this.casesRepo.createCaseHistory({
        case_id: caseId,
        changed_by: user.id,
        field: "document",
        old_value: "",
        new_value: dto.label,
        note: "Adjunto agregado por el usuario.",
      });

      await this.notificationService.createNotification({
        title: "Nuevo adjunto en el caso",
        description: `Se ha añadido un archivo: ${dto.label}`,
        type: "info",
        receiverId,
        url: `/cases/${caseId}`,
      });

      return created;
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        throw new AppError(
          MESSAGES.CASE.ATTACHMENT_DUPLICATE,
          HttpStatusCodes.CONFLICT.code
        );
      }
      throw err;
    }
  }

  async archiveAttachment(attId: number, userId: number) {
    const attachment = await this.casesRepo.findAttachmentById(attId);
    if (!attachment || attachment.archived) {
      throw new AppError(
        "Archivo no encontrado o ya está archivado.",
        HttpStatusCodes.NOT_FOUND.code
      );
    }

    const caseInfo = await this.casesRepo.findCaseByServiceId(
      attachment.service_id
    );
    if (!caseInfo) {
      throw new AppError("Caso no encontrado.", HttpStatusCodes.NOT_FOUND.code);
    }

    const { client_id, lawyer_id } = caseInfo.service;
    const isAuthorized = userId === client_id || userId === lawyer_id;
    if (!isAuthorized) {
      throw new AppError(
        MESSAGES.CASE.ACCESS_DENIED,
        HttpStatusCodes.FORBIDDEN.code
      );
    }

    await this.casesRepo.updateAttachment(attId, { archived: true });

    await this.casesRepo.createCaseHistory({
      case_id: caseInfo.id,
      changed_by: userId,
      field: "document",
      old_value: attachment.label,
      new_value: "archivado",
      note: "El archivo fue archivado por el usuario.",
    });

    const receiverId = userId === client_id ? lawyer_id : client_id;
    if (receiverId) {
      await this.notificationService.createNotification({
        title: "Archivo archivado",
        description: `Se ha archivado el archivo: ${attachment.label}`,
        type: "info",
        receiverId,
        url: `/cases/${caseInfo.id}`,
      });
    }
  }

  async getAttachmentUrl(
    caseId: number,
    attId: number,
    user: { id: number; role: "client" | "lawyer" }
  ) {
    const found = await this.casesRepo.findCaseById(caseId);
    if (!found)
      throw new AppError(
        MESSAGES.CASE.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );

    const clientId = found.service?.client_id ?? null;
    const lawyerId = found.service?.lawyer_id ?? null;

    const att = await this.casesRepo.findAttachmentById(attId);
    if (!att || att.archived)
      throw new AppError(
        "Attachment not found",
        HttpStatusCodes.NOT_FOUND.code
      );

    const isUploader =
      user.role === att.uploaded_by &&
      (user.id === clientId || user.id === lawyerId);
    if (!isUploader) {
      throw new AppError(
        MESSAGES.CASE.ACCESS_DENIED,
        HttpStatusCodes.FORBIDDEN.code
      );
    }

    const signedUrl = await getSignedUrl(att.file_key);

    return signedUrl;
  }
  async listAttachments(
    caseId: number,
    user: { id: number; role: "client" | "lawyer" }
  ) {
    await this.getCaseById(caseId, user);

    const atts = await this.casesRepo.findAttachmentsByServiceId(caseId);

    // 3) Mapear a signed-URL
    return Promise.all(
      atts.map(async (a) => ({
        id: a.id,
        label: a.label,
        description: a.description,
        category_id: a.category_id,
        uploaded_by: a.uploaded_by,
        created_at: a.created_at,
        url: await getSignedUrl(a.file_key),
      }))
    );
  }
  /* ───────────── CLIENT EXTERNAL ───────────── */
  async createExternalClient(
    dto: CreateExternalClientDto,
    userDetailId: number
  ) {
    const email = dto.email ?? "";

    return this.casesRepo.createExternalClient({
      full_name: dto.full_name,
      email,
      phone: dto.phone,
      dni: dto.dni,
      user_detail: { connect: { user_id: userDetailId } },
    });
  }
  /* ---------- historial ---------- */
  async getHistory(
    caseId: number,
    user: { id: number; role: "client" | "lawyer" }
  ) {
    const found = await this.casesRepo.findCaseById(caseId);
    if (!found) {
      throw new AppError(
        MESSAGES.CASE.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );
    }

    const clientId = found.service?.client_id ?? null;
    const lawyerId = found.service?.lawyer_id ?? null;

    if (
      (user.role === "client" && clientId !== user.id) ||
      (user.role === "lawyer" && lawyerId !== user.id)
    ) {
      throw new AppError(
        MESSAGES.CASE.ACCESS_DENIED,
        HttpStatusCodes.FORBIDDEN.code
      );
    }

    return this.casesRepo.getCaseHistory(caseId);
  }

  /* ---------- mensaje interno ---------- */
  async sendMessage(
    caseId: number,
    dto: CreateCaseMessageDto,
    sender: { id: number; role: "client" | "lawyer" }
  ) {
    const found = await this.casesRepo.findCaseById(caseId);
    if (!found) {
      throw new AppError(
        MESSAGES.CASE.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );
    }

    const clientId = found.service?.client_id ?? null;
    const lawyerId = found.service?.lawyer_id ?? null;

    if (clientId !== sender.id && lawyerId !== sender.id) {
      throw new AppError(
        MESSAGES.CASE.ACCESS_DENIED,
        HttpStatusCodes.FORBIDDEN.code
      );
    }

    const msg = await this.casesRepo.createMessage({
      service: { connect: { id: found.service_id } },
      content: dto.content,
      sent_by: sender.role as actor_type,
      is_read: false,
    });

    const receiverId = sender.id === clientId ? lawyerId : clientId;
    if (receiverId) {
      await this.notificationService.createNotification({
        title: MESSAGES.CASE.MESSAGE_SENT,
        description: `New message in case “${found.title}”`,
        type: "info",
        receiverId,
        senderId: sender.id,
        url: `/case/${caseId}`,
      });

      io.to(`user:${receiverId}`).emit("CASE_NEW_MESSAGE", {
        caseId,
        messageId: msg.id,
      });
    }

    return msg;
  }

}
