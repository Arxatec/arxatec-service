import {  Prisma, case_status, case_category, case_type } from "@prisma/client";
import { CasesRepository } from "../../data/repository/cases.repository";
import { NotificationRepository } from "../../../notification/data/repository/notification.repository";
import {
  CreateCaseDto,
  UpdateCaseDto,
  ChangeStatusCaseDto,
  CreateCaseAttachmentDto,
  CreateExternalClientDto,
  CreateCaseMessageDto,
} from "../../domain/dtos/index";
import { AppError } from "../../../../utils/errors";
import { HttpStatusCodes } from "../../../../constants/http_status_codes";
import { MESSAGES } from "../../../../constants/messages";
import { io } from "../../../../config/socket";

export class CasesService {
  private readonly MAX_OPEN_CLIENT = 5;
  private readonly MAX_INPROGRESS_LAWYER =
    Number(process.env.MAX_LAWYER_CASES) || 10;

  constructor(
    private readonly casesRepo = new CasesRepository(),
    private readonly notifRepo = new NotificationRepository()
  ) {}

  /* ───────────── CREATE ───────────── */

  async createCase(
    dto: CreateCaseDto,
    user: { id: number; role: "client" | "lawyer" }
  ) {
    if (user.role === "client") {
      const openCount = await this.casesRepo
        .exploreCases("client", {
          status: ["open", "taken", "in_progress"],
          lawyerId: undefined,
          archived: false,
        })
        .then((res) => res.length);
  
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
      if (!isPublic) {
        lawyerId = user.id;
      }
    }
  
    if (dto.external_client_id && !lawyerId) {
      const externalClient = await this.casesRepo.findExternalClientById(dto.external_client_id);
      if (externalClient?.lawyer_id) {
        lawyerId = externalClient.lawyer_id;
      }
    }
  
    const created = await this.casesRepo.createCase({
      title: dto.title,
      description: dto.description,
      category: dto.category,
      type: dto.type,
      is_public: isPublic,
      status: "open",
      client: user.role === "client" ? { connect: { id: user.id } } : undefined,
      lawyer: lawyerId ? { connect: { id: lawyerId } } : undefined,
      externalClient: dto.external_client_id
        ? { connect: { id: dto.external_client_id } }
        : undefined,
    });
  
    await this.notifRepo.createNotification({
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

  async getCaseById(
    id: number,
    user: { id: number; role: "client" | "lawyer" }
  ) {
    const found = await this.casesRepo.findById(id);
    if (!found)
      throw new AppError(
        MESSAGES.CASE.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );

    // permissions
    if (user.role === "client" && found.client_id !== user.id) {
      throw new AppError(
        MESSAGES.CASE.ACCESS_DENIED,
        HttpStatusCodes.FORBIDDEN.code
      );
    }
    if (
      user.role === "lawyer" &&
      found.lawyer_id !== user.id &&
      !found.is_public
    ) {
      throw new AppError(
        MESSAGES.CASE.ACCESS_DENIED,
        HttpStatusCodes.FORBIDDEN.code
      );
    }
    return found;
  }

  async exploreCases(
    role: "client" | "lawyer",
    filters: Parameters<CasesRepository["exploreCases"]>[1]
  ) {
    return this.casesRepo.exploreCases(role, filters);
  }

  async getMyCases(user: { id: number; role: "client" | "lawyer" }) {
    return this.casesRepo.findMyCases(user.id, user.role);
  }

  /* ───────────── UPDATE ───────────── */

  async updateCase(
    id: number,
    dto: UpdateCaseDto,
    user: { id: number; role: "client" | "lawyer" }
  ) {
    const found = await this.casesRepo.findById(id);
    if (!found)
      throw new AppError(
        MESSAGES.CASE.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );

    // permissions
    if (
      (user.role === "client" && found.client_id !== user.id) ||
      (user.role === "lawyer" && found.lawyer_id !== user.id)
    ) {
      throw new AppError(
        MESSAGES.CASE.ACCESS_DENIED,
        HttpStatusCodes.FORBIDDEN.code
      );
    }

    return this.casesRepo.updateCase(id, {
      title: dto.title,
      description: dto.description,
      category: dto.category,
      type: dto.type,
      is_public: dto.is_public,
    });
  }
  /* ───────────── STATUS ───────────── */
  async changeStatus(
    id: number,
    dto: ChangeStatusCaseDto,
    user: { id: number; role: "client" | "lawyer" }
  ) {
    const found = await this.casesRepo.findById(id);
    if (!found) {
      throw new AppError(
        MESSAGES.CASE.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );
    }

    /* 1. Validar transición */
    if (!this.isTransitionValid(found.status, dto.target_status, user.role)) {
      throw new AppError(
        MESSAGES.CASE.INVALID_STATUS,
        HttpStatusCodes.CONFLICT.code
      );
    }

    if (
      dto.target_status === "closed" &&
      (user.role !== "lawyer" || found.lawyer_id !== user.id)
    ) {
      throw new AppError(
        MESSAGES.CASE.CLOSE_ONLY_LAWYER,
        HttpStatusCodes.FORBIDDEN.code
      );
    }

    if (user.role === "lawyer" && dto.target_status === "in_progress") {
      const running = await this.casesRepo
        .exploreCases("lawyer", {
          status: "in_progress",
          lawyerId: user.id,
          archived: false,
        })
        .then((r) => r.length);

      if (running >= this.MAX_INPROGRESS_LAWYER) {
        throw new AppError(
          MESSAGES.CASE.LIMIT_INPROGRESS_LAWYER,
          HttpStatusCodes.CONFLICT.code
        );
      }
    }

    const updated = await this.casesRepo.changeStatus(
      id,
      dto.target_status,
      user.id,
      user.role === "lawyer" ? user.id : null
    );

    if (dto.target_status === "taken" && found.client_id) {
      await this.notifRepo.createNotification({
        title: MESSAGES.CASE.TAKEN_TITLE,
        description: `Your case “${found.title}” was taken by a lawyer`,
        type: "info",
        receiverId: found.client_id,
        senderId: user.id,
        url: `/case/${id}`,
      });
      io.to(`user:${found.client_id}`).emit("CASE_TAKEN", { id });
    }

    return updated;
  }

  /* ───────────── ARCHIVE ───────────── */

  async archiveCase(
    id: number,
    user: { id: number; role: "client" | "lawyer" }
  ) {
    const found = await this.casesRepo.findById(id);
    if (!found)
      throw new AppError(
        MESSAGES.CASE.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );

    if (
      (user.role === "client" && found.client_id !== user.id) ||
      (user.role === "lawyer" && found.lawyer_id !== user.id)
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
    id: number,
    dto: CreateCaseAttachmentDto,
    userId: number
  ) {
    const found = await this.casesRepo.findById(id);
    if (!found) {
      throw new AppError(
        MESSAGES.CASE.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );
    }

    if (found.client_id !== userId && found.lawyer_id !== userId) {
      throw new AppError(
        MESSAGES.CASE.ACCESS_DENIED,
        HttpStatusCodes.FORBIDDEN.code
      );
    }

    try {
      return await this.casesRepo.addAttachment({
        case: { connect: { id } },
        file_url: dto.file_url,
        filename: dto.filename,
        uploadedBy: { connect: { id: userId } },
      });
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
    return this.casesRepo.archiveAttachment(attId, userId);
  }

  /* ───────────── HELPERS ───────────── */

  private isTransitionValid(
    current: case_status,
    next: case_status,
    role: "client" | "lawyer"
  ) {
    const map: Record<case_status, case_status[]> = {
      open: ["taken", "archived"],
      taken: ["in_progress", "archived"],
      in_progress: ["closed", "archived"],
      closed: [], // no retrocede salvo admin
      archived: [],
    };
    const allowed = map[current];
    return allowed.includes(next) && (next !== "taken" || role === "lawyer");
  }
  /* ───────────── CLIENT EXTERNAL ───────────── */
  async createExternalClient(dto: CreateExternalClientDto, lawyerId: number) {
    return this.casesRepo.createExternalClient({
      first_name: dto.first_name,
      last_name: dto.last_name,
      email: dto.email,
      phone: dto.phone,
    }, lawyerId);
  }
  getCategories() {
    return Object.values(case_category);
  }

  getTypes() {
    return Object.values(case_type);
  }

  /* ---------- historial ---------- */
  async getHistory(
    caseId: number,
    user: { id: number; role: "client" | "lawyer" }
  ) {
    const found = await this.casesRepo.findById(caseId);
    if (!found)
      throw new AppError(
        MESSAGES.CASE.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );
    if (
      (user.role === "client" && found.client_id !== user.id) ||
      (user.role === "lawyer" && found.lawyer_id !== user.id)
    )
      throw new AppError(
        MESSAGES.CASE.ACCESS_DENIED,
        HttpStatusCodes.FORBIDDEN.code
      );

    return this.casesRepo.getCaseHistory(caseId);
  }

  /* ---------- mensaje interno ---------- */
  async sendMessage(
    caseId: number,
    dto: CreateCaseMessageDto,
    sender: { id: number; role: "client" | "lawyer" }
  ) {
    const found = await this.casesRepo.findById(caseId);
    if (!found)
      throw new AppError(
        MESSAGES.CASE.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );

    if (found.client_id !== sender.id && found.lawyer_id !== sender.id) {
      throw new AppError(
        MESSAGES.CASE.ACCESS_DENIED,
        HttpStatusCodes.FORBIDDEN.code
      );
    }

    const msg = await this.casesRepo.createMessage({
      case: { connect: { id: caseId } },
      sender: { connect: { id: sender.id } },
      content: dto.content,
    });

    const receiverId =
      found.client_id === sender.id ? found.lawyer_id : found.client_id;
    if (receiverId) {
      await this.notifRepo.createNotification({
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
