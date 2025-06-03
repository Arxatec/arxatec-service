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
  UpdateExternalClientDto,
  CreateCaseMessageDto,
} from "../../domain/dtos";

import type { ExternalClientEntity } from "../../domain/entities/external_client.entity";

import { AppError } from "../../../../utils/errors";
import { HttpStatusCodes } from "../../../../constants/http_status_codes";
import { MESSAGES } from "../../../../constants/messages";
import { getSignedUrl } from "../../../../infrastructure/aws";
import { io } from "../../../../config/socket";

type CurrentUser = { id: number; role: "client" | "lawyer" };

export class CasesService {
  private readonly MAX_INPROGRESS_LAWYER = 5;

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
  const initialStatus = statuses[0].id;
  const takenStatus = statuses[1].id;

  if (user.role === "client") {
    const maxOpen = 3;
    const maxTaken = 3;

    const openCount = await this.casesRepo.countClientCasesByStatus({
      clientId: user.id,
      status_id: initialStatus,
    });
    if (openCount >= maxOpen) {
      throw new AppError(
        `Has alcanzado el límite de ${maxOpen} casos abiertos.`,
        HttpStatusCodes.CONFLICT.code
      );
    }

    const takenCount = await this.casesRepo.countClientCasesByStatus({
      clientId: user.id,
      status_id: takenStatus,
    });
    if (takenCount >= maxTaken) {
      throw new AppError(
        `Has alcanzado el límite de ${maxTaken} casos tomados.`,
        HttpStatusCodes.CONFLICT.code
      );
    }
  }

  let isPublic = dto.is_public ?? true;
  let lawyerId: number | null = null;

  if (user.role === "client" && dto.selected_lawyer_id) {
    isPublic = false;
    lawyerId = dto.selected_lawyer_id;
  } else if (user.role === "lawyer") {
    isPublic = dto.is_public ?? false;
    if (!isPublic) lawyerId = user.id;
  }


  if (dto.external_client_id) {
    const ext = await this.casesRepo.findExternalClientByIdForLawyer(
      dto.external_client_id,
      user.id
    );
    if (!ext) {
      throw new AppError(
        "No puedes usar un cliente externo que no exista o que esté archivado",
        HttpStatusCodes.FORBIDDEN.code
      );
    }

    lawyerId = user.id;
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
    dto.selected_lawyer_id || user.role === "lawyer"
      ? takenStatus
      : initialStatus;

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

    if (found.archived) {
      throw new AppError(
        "No se puede editar un caso archivado.",
        HttpStatusCodes.CONFLICT.code
      );
    }

    const statuses = await this.casesRepo.getAllStatuses();
    if (statuses.length < 3) {
      throw new AppError(
        "Deben existir al menos 3 estados configurados.",
        HttpStatusCodes.INTERNAL_SERVER_ERROR.code
      );
    }
    const closedId = statuses[statuses.length - 1].id;
    if (found.status_id === closedId) {
      throw new AppError(
        "No se puede editar un caso cerrado.",
        HttpStatusCodes.CONFLICT.code
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
  async changeStatus(id: number, dto: ChangeCaseStatusDto, user: CurrentUser) {
    const found = await this.casesRepo.findCaseById(id);
    if (!found) {
      throw new AppError(
        MESSAGES.CASE.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );
    }

    if (found.archived) {
      throw new AppError(
        "No se puede cambiar el estado de un caso archivado.",
        HttpStatusCodes.CONFLICT.code
      );
    }

    const statuses = await this.casesRepo.getAllStatuses();
    if (statuses.length < 3) {
      throw new AppError(
        "Deben haber al menos 3 estados configurados (abierto, tomado, cerrado).",
        HttpStatusCodes.INTERNAL_SERVER_ERROR.code
      );
    }
    const openId = statuses[0].id;
    const takenId = statuses[1].id;
    const closedId = statuses[statuses.length - 1].id;

    const currentId = found.status_id;
    const nextId = dto.status_id;
    const clientId = found.service?.client_id ?? null;
    const lawyerId = found.service?.lawyer_id ?? null;

    if (currentId === openId) {
      if (nextId !== takenId) {
        throw new AppError(
          "Solo se puede pasar de 'Abierto' a 'Tomado'.",
          HttpStatusCodes.CONFLICT.code
        );
      }
    } else if (currentId === takenId) {
      if (nextId !== closedId) {
        throw new AppError(
          "Solo se puede pasar de 'Tomado' a 'Cerrado'.",
          HttpStatusCodes.CONFLICT.code
        );
      }
    } else {
      throw new AppError(
        "No se puede cambiar el estado de un caso ya cerrado.",
        HttpStatusCodes.CONFLICT.code
      );
    }

    if (user.role === "lawyer" && currentId === openId && nextId === takenId) {
      const count = await this.casesRepo.countLawyerCasesByStatus({
        lawyerId: user.id,
        status_id: takenId,
        excludeExternal: true,
      });
      if (count >= this.MAX_INPROGRESS_LAWYER) {
        throw new AppError(
          MESSAGES.CASE.LIMIT_INPROGRESS_LAWYER,
          HttpStatusCodes.CONFLICT.code
        );
      }
    }

    if (user.role === "lawyer" && currentId === openId && !lawyerId) {
      await this.casesRepo.assignLawyerToService(found.service_id, user.id);
    }

    if (user.role === "lawyer" && nextId === closedId && lawyerId !== user.id) {
      throw new AppError(
        MESSAGES.CASE.CLOSE_ONLY_LAWYER,
        HttpStatusCodes.FORBIDDEN.code
      );
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
async archiveCase(id: number, user: CurrentUser) {
  const found = await this.casesRepo.findCaseById(id);
  if (!found) {
    throw new AppError(
      MESSAGES.CASE.NOT_FOUND,
      HttpStatusCodes.NOT_FOUND.code
    );
  }

  const creatorId =
    found.service.client_id === user.id
      ? found.service.client_id
      : found.service.lawyer_id === user.id
      ? found.service.lawyer_id
      : null;
  if (!creatorId) {
    throw new AppError(
      "Solo el cliente o abogado originador puede archivar este caso.",
      HttpStatusCodes.FORBIDDEN.code
    );
  }

  if (found.archived) {
    throw new AppError(
      "El caso ya está archivado.",
      HttpStatusCodes.CONFLICT.code
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

  if (found.archived) {
    throw new AppError(
      "No se pueden agregar adjuntos a un caso archivado.",
      HttpStatusCodes.CONFLICT.code
    );
  }

  const statuses = await this.casesRepo.getAllStatuses();
  const closedId = statuses[statuses.length - 1].id;
  if (found.status_id === closedId) {
    throw new AppError(
      "No se pueden agregar adjuntos a un caso cerrado.",
      HttpStatusCodes.CONFLICT.code
    );
  }

  const categories = await this.casesRepo.getAllCategories();
  if (!categories.some((c) => c.id === dto.category_id)) {
    throw new AppError(
      "Categoría de adjunto no válida.",
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

  let receiverId: number | null = null;
  if (user.role === "client") {
    receiverId = lawyerId;
  } else {
    receiverId = clientId;
    if (!receiverId) {
      receiverId = null;
    }
  }

  try {
    const created = await this.casesRepo.addAttachment({
      service:     { connect: { id: found.service_id } },
      category:    { connect: { id: dto.category_id } },
      file_key:    dto.file_key,
      label:       dto.label,
      description: dto.description,
      uploaded_by: user.role as actor_type,
      archived:    false,
    });

    await this.casesRepo.createCaseHistory({
      case_id:    caseId,
      changed_by: user.id,
      field:      "document",
      old_value:  "",
      new_value:  dto.label,
      note:       "Adjunto agregado por el usuario.",
    });

    if (receiverId) {
      await this.notificationService.createNotification({
        title:       "Nuevo adjunto en el caso",
        description: `Se ha añadido un archivo: ${dto.label}`,
        type:        "info",
        receiverId,
        url:         `/cases/${caseId}`,
      });
    }

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

  async archiveAttachment(
    caseId: number,
    attId: number,
    user: { id: number; role: "client" | "lawyer" }
  ) {
    const foundCase = await this.getCaseById(caseId, user);

    const attachment = await this.casesRepo.findAttachmentByServiceIdAndId(
      attId,
      caseId
    );
    if (!attachment || attachment.archived) {
      throw new AppError(
        "Attachment no encontrado o ya está archivado.",
        HttpStatusCodes.NOT_FOUND.code
      );
    }

    const archived = await this.casesRepo.archiveAttachment(attId, user.id);

    const clientId = foundCase.service.client_id;
    const lawyerId = foundCase.service.lawyer_id;
    const receiverId = user.id === clientId ? lawyerId : clientId;
    if (receiverId) {
      await this.notificationService.createNotification({
        title: "Archivo archivado",
        description: `Se ha archivado el archivo: ${attachment.label}`,
        type: "info",
        receiverId,
        url: `/cases/${caseId}`,
      });
    }

    return archived;
  }

  async getAttachmentUrl(
    caseId: number,
    attId: number,
    user: CurrentUser
  ): Promise<string> {
    const foundCase = await this.getCaseById(caseId, user);
    const clientId = foundCase.service.client_id;
    const lawyerId = foundCase.service.lawyer_id;

    const attachment = await this.casesRepo.findAttachmentByServiceIdAndId(
      attId,
      caseId
    );
    if (!attachment || attachment.archived) {
      throw new AppError(
        "Archivo no encontrado o ya está archivado.",
        HttpStatusCodes.NOT_FOUND.code
      );
    }

    if (
      user.role !== attachment.uploaded_by ||
      (user.id !== clientId && user.id !== lawyerId)
    ) {
      throw new AppError(
        MESSAGES.CASE.ACCESS_DENIED,
        HttpStatusCodes.FORBIDDEN.code
      );
    }

    return await getSignedUrl(attachment.file_key);
  }


  async listAttachments(
    caseId: number,
    user: CurrentUser
  ): Promise<
    Array<{
      id: number;
      label: string;
      description: string | null;
      category_id: number;
      uploaded_by: "client" | "lawyer";
      created_at: Date;
      url: string;
    }>
  > {
    await this.getCaseById(caseId, user);

    const attachments = await this.casesRepo.findAttachmentsByServiceId(caseId);

    return Promise.all(
      attachments.map(async (a) => ({
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
  ): Promise<ExternalClientEntity> {
    return this.casesRepo.createExternalClient({
      full_name: dto.full_name,
      email: dto.email ?? "",
      phone: dto.phone,
      dni: dto.dni,
      user_detail: { connect: { user_id: userDetailId } },
    });
  }

  async listExternalClients(
    userDetailId: number
  ): Promise<ExternalClientEntity[]> {
    return this.casesRepo.findExternalClientsByLawyer(userDetailId);
  }

  async updateExternalClient(
    id: number,
    dto: UpdateExternalClientDto,
    userDetailId: number
  ): Promise<ExternalClientEntity> {
    const client = await this.casesRepo.findExternalClientByIdForLawyer(
      id,
      userDetailId
    );
    if (!client) {
      throw new AppError(
        "Cliente externo no encontrado o no te pertenece",
        HttpStatusCodes.NOT_FOUND.code
      );
    }
    return this.casesRepo.updateExternalClient(id, userDetailId, {
      full_name: dto.full_name,
      email: dto.email,
      phone: dto.phone,
      dni: dto.dni,
    });
  }

  async archiveExternalClient(
    id: number,
    userDetailId: number
  ): Promise<ExternalClientEntity> {
    const client = await this.casesRepo.findExternalClientByIdForLawyer(
      id,
      userDetailId
    );
    if (!client) {
      throw new AppError(
        "Cliente externo no encontrado o no te pertenece",
        HttpStatusCodes.NOT_FOUND.code
      );
    }
    return this.casesRepo.archiveExternalClient(id, userDetailId);
  }
  async listArchivedExternalClients(
    userDetailId: number
  ): Promise<ExternalClientEntity[]> {
    return this.casesRepo.findArchivedExternalClientsByLawyer(userDetailId);
  }

  async restoreExternalClient(
    id: number,
    userDetailId: number
  ): Promise<ExternalClientEntity> {
    const client = await this.casesRepo.findArchivedClientForLawyer(
      id,
      userDetailId
    );
    if (!client || !client.archived) {
      throw new AppError(
        "Cliente externo no encontrado o no está archivado",
        HttpStatusCodes.NOT_FOUND.code
      );
    }
    return this.casesRepo.restoreExternalClient(id, userDetailId);
  }

  /* ───────────── HISTORY ───────────── */
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
  /* ───────────── CLOSED & ARCHIVED LISTS ───────────── */
  async listClosedCases(user: CurrentUser) {
    const statuses = await this.casesRepo.getAllStatuses();
    const penultimateId = statuses[statuses.length - 2].id;
    return this.casesRepo.findCasesByUserAndStatus({
      userId: user.id,
      role: user.role,
      status_id: penultimateId,
    });
  }

  async listArchivedCases(user: CurrentUser) {
    return this.casesRepo.findCasesByUserAndArchived(user.id, user.role);
  }

  /* ───────────── REOPEN CASE ───────────── */
  async reopenCase(id: number, user: CurrentUser) {
    const found = await this.casesRepo.findCaseById(id);
    if (!found)
      throw new AppError(
        MESSAGES.CASE.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );

    const isCreator =
      found.service.client_id === user.id ||
      found.service.lawyer_id === user.id;
    if (!isCreator) {
      throw new AppError(
        "Solo el creador del caso puede reabrirlo.",
        HttpStatusCodes.FORBIDDEN.code
      );
    }

    if (!found.archived) {
      throw new AppError(
        "Solo los casos archivados pueden reabrirse.",
        HttpStatusCodes.CONFLICT.code
      );
    }

    const restored = await this.casesRepo.restoreCase(id, user.id);
    return restored;
  }

  //* ───────────── MESSAGES INTERNAL ───────────── */
async sendMessage(
  caseId: number,
  dto: CreateCaseMessageDto,
  sender: { id: number; role: "client" | "lawyer" }
) {
  // 1) Recuperar el caso
  const found = await this.casesRepo.findCaseById(caseId);
  if (!found) {
    throw new AppError(
      MESSAGES.CASE.NOT_FOUND,
      HttpStatusCodes.NOT_FOUND.code
    );
  }

  // 2) Bloquear si el caso está archivado
  if (found.archived) {
    throw new AppError(
      "No se pueden enviar mensajes a un caso archivado",
      HttpStatusCodes.CONFLICT.code
    );
  }

  // 3) Obtener IDs de cliente y abogado asignado
  const clientId = found.service?.client_id ?? null;
  const lawyerId = found.service?.lawyer_id ?? null;

  // 4) No permitir enviar mensajes si aún no hay abogado asignado
  if (!lawyerId) {
    throw new AppError(
      "No puedes enviar mensajes hasta que un abogado tome el caso",
      HttpStatusCodes.CONFLICT.code
    );
  }

  // 5) Validar que el emisor sea parte de este caso
  if (sender.role === "client" && clientId !== sender.id) {
    throw new AppError(
      MESSAGES.CASE.ACCESS_DENIED,
      HttpStatusCodes.FORBIDDEN.code
    );
  }
  if (sender.role === "lawyer" && lawyerId !== sender.id) {
    throw new AppError(
      MESSAGES.CASE.NOT_ASSIGNED_TO_LAWYER,
      HttpStatusCodes.FORBIDDEN.code
    );
  }

  // 6) Crear el mensaje
  const msg = await this.casesRepo.createMessage({
    service: { connect: { id: found.service_id } },
    content: dto.content,
    sent_by: sender.role as actor_type,
    is_read: false,
  });

  // 7) Notificar al destinatario
  const receiverId = sender.id === clientId ? lawyerId : clientId;
  if (receiverId) {
    await this.notificationService.createNotification({
      title:      MESSAGES.CASE.MESSAGE_SENT,
      description:`New message in case “${found.title}”`,
      type:       "info",
      receiverId,
      senderId:   sender.id,
      url:        `/case/${caseId}`,
    });
    io.to(`user:${receiverId}`).emit("CASE_NEW_MESSAGE", {
      caseId,
      messageId: msg.id,
    });
  }

  return msg;
}

}
