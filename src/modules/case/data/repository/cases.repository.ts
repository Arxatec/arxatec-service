// src/modules/case/data/repository/cases.repositoryts
import { PrismaClient, Prisma, Attachments, Services } from "@prisma/client";

const prisma = new PrismaClient();

export class CasesRepository {
  /* ───────────── CATALOGS ───────────── */
  getAllCategories() {
    return prisma.caseCategories.findMany({ orderBy: { name: "asc" } });
  }

  getAllStatuses() {
    return prisma.caseStatuses.findMany({ orderBy: { id: "asc" } });
  }

  getStatusById(id: number) {
    return prisma.caseStatuses.findUnique({ where: { id } });
  }

  /* ───────────── UTILITY ───────────── */
  async getOpenStatusId() {
    const row = await prisma.caseStatuses.findFirst({
      where: { name: "abierto" },
    });
    return row?.id ?? 1;
  }
  async countClientCasesByStatus(params: {
    clientId: number;
    status_id: number;
  }) {
    return prisma.cases.count({
      where: {
        service: { client_id: params.clientId },
        status_id: params.status_id,
        archived: false,
      },
    });
  }
  async countLawyerCasesByStatus(params: {
    lawyerId: number;
    status_id: number;
    excludeExternal?: boolean;
  }) {
    return prisma.cases.count({
      where: {
        status_id: params.status_id,
        archived: false,
        service: {
          lawyer_id: params.lawyerId,
          ...(params.excludeExternal && { external_client_id: null }),
        },
      },
    });
  }
  async findCaseLight(id: number): Promise<{
    id: number;
    archived: boolean;
    status_id: number;
  } | null> {
    return prisma.cases.findUnique({
      where: { id },
      select: {
        id: true,
        archived: true,
        status_id: true,
      },
    });
  }

  private closedStatusId: number | null = null;

  async getClosedStatusId(): Promise<number> {
    if (this.closedStatusId !== null) return this.closedStatusId;

    const closed = await prisma.caseStatuses.findFirst({
      orderBy: { id: "desc" }, // último registro
      select: { id: true },
    });

    if (!closed) {
      throw new Error("No hay estados de caso configurados.");
    }

    this.closedStatusId = closed.id;
    return closed.id;
  }

  async isCaseActive(id: number): Promise<boolean> {
    const data = await this.findCaseLight(id);
    if (!data) return false;
    return (
      !data.archived && data.status_id !== (await this.getClosedStatusId())
    );
  }
  /* ───────────── CREATE ───────────── */
  async createService(data: Prisma.ServicesCreateInput) {
    return prisma.services.create({ data });
  }

  async createCase(data: Prisma.CasesCreateInput) {
    return prisma.cases.create({ data });
  }

  async addAttachment(data: Prisma.AttachmentsCreateInput) {
    return prisma.attachments.create({ data });
  }

  async createMessage(data: Prisma.MessagesCreateInput) {
    return prisma.messages.create({ data });
  }

  async createCaseHistory(data: {
    case_id: number;
    changed_by: number;
    field: string;
    old_value: string;
    new_value: string;
    note?: string;
  }) {
    return prisma.caseHistories.create({ data });
  }
  /* ───────────── EXTERNAL CLIENTS ───────────── */
  async createExternalClient(data: Prisma.ExternalClientsCreateInput) {
    return prisma.externalClients.create({ data });
  }

  async findExternalClientsByLawyer(userDetailId: number) {
    return prisma.externalClients.findMany({
      where: {
        user_detail_id: userDetailId,
        archived: false,
      },
      orderBy: { created_at: "desc" },
    });
  }

  async findExternalClientByIdForLawyer(id: number, userDetailId: number) {
    return prisma.externalClients.findFirst({
      where: {
        id,
        user_detail_id: userDetailId,
        archived: false,
      },
    });
  }

  async updateExternalClient(
    id: number,
    userDetailId: number,
    data: Prisma.ExternalClientsUpdateInput
  ) {
    const client = await this.findExternalClientByIdForLawyer(id, userDetailId);
    if (!client)
      throw new Error("External client not found or not owned by this lawyer");
    return prisma.externalClients.update({
      where: { id },
      data,
    });
  }

  async archiveExternalClient(id: number, userDetailId: number) {
    const client = await this.findExternalClientByIdForLawyer(id, userDetailId);
    if (!client)
      throw new Error("External client not found or not owned by this lawyer");
    return prisma.externalClients.update({
      where: { id },
      data: { archived: true },
    });
  }

  async findArchivedExternalClientsByLawyer(userDetailId: number) {
    return prisma.externalClients.findMany({
      where: {
        user_detail_id: userDetailId,
        archived: true,
      },
      orderBy: { created_at: "desc" },
    });
  }

  async findArchivedClientForLawyer(id: number, userDetailId: number) {
    return prisma.externalClients.findFirst({
      where: {
        id,
        user_detail_id: userDetailId,
        archived: true,
      },
    });
  }

  async restoreExternalClient(id: number, userDetailId: number) {
    const client = await this.findArchivedClientForLawyer(id, userDetailId);
    if (!client) {
      throw new Error("External client not found or not archived");
    }
    return prisma.externalClients.update({
      where: { id },
      data: { archived: false },
    });
  }

  /* ───────────── READ ───────────── */

  async findCaseById(id: number) {
    return prisma.cases.findUnique({
      where: { id },
      include: {
        service: {
          include: {
            attachments: { where: { archived: false } },
            messages: true,
            consultations: true,
          },
        },
        histories: true,
        category: true,
        status: true,
      },
    });
  }

  async findCasesByUser(userId: number, role: "client" | "lawyer") {
    const whereCondition =
      role === "client"
        ? { service: { client_id: userId } }
        : { service: { lawyer_id: userId } };

    return prisma.cases.findMany({
      where: {
        ...whereCondition,
        archived: false,
      },
      orderBy: { created_at: "desc" },
    });
  }

  async exploreCases(filters: {
    category_id?: number;
    status_id?: number;
    is_public?: boolean;
    archived?: boolean;
    lawyerId?: number | null;
  }) {
    const {
      category_id,
      status_id,
      is_public,
      archived = false,
      lawyerId,
    } = filters;

    const where: Prisma.CasesWhereInput = {
      archived,
      ...(category_id && { category_id }),
      ...(status_id && { status_id }),
      ...(is_public !== undefined && { is_public }),
      ...(lawyerId !== undefined && { service: { lawyer_id: lawyerId } }),
    };

    return prisma.cases.findMany({
      where,
      orderBy: { created_at: "desc" },
    });
  }

  async findCaseByServiceId(serviceId: number) {
    return prisma.cases.findFirst({
      where: { service_id: serviceId },
      include: {
        service: true,
      },
    });
  }

  async findAttachmentById(attId: number) {
    return prisma.attachments.findUnique({
      where: { id: attId },
    });
  }
  async findAttachmentByServiceIdAndId(attId: number, serviceId: number) {
    return prisma.attachments.findFirst({
      where: {
        id: attId,
        service_id: serviceId,
      },
    });
  }
  async getCaseHistory(caseId: number) {
    return prisma.caseHistories.findMany({
      where: { case_id: caseId },
      orderBy: { created_at: "desc" },
    });
  }
  async findAttachmentsByServiceId(serviceId: number) {
    return prisma.attachments.findMany({
      where: { service_id: serviceId, archived: false },
      orderBy: { created_at: "asc" },
    });
  }

  /* ───────────── UPDATE ───────────── */
  async updateCase(id: number, data: Prisma.CasesUpdateInput) {
    return prisma.cases.update({ where: { id }, data });
  }

  async updateAttachment(attId: number, data: Partial<Attachments>) {
    return prisma.attachments.update({
      where: { id: attId },
      data,
    });
  }

  /* ───────────── ASSIGN LAWYER ───────────── */
  async assignLawyerToService(serviceId: number, lawyerId: number) {
    return prisma.services.update({
      where: { id: serviceId },
      data: { lawyer_id: lawyerId },
    });
  }
  /* ───────────── UNASSIGN LAWYER ───────────── */
  async unassignLawyerFromService(serviceId: number): Promise<Services> {
    return prisma.services.update({
      where: { id: serviceId },
      data: { lawyer_id: null },
    });
  }
  /* ───────────── CHANGE STATUS ───────────── */
  changeStatus(caseId: number, nextStatusId: number, changedBy: number) {
    return prisma.$transaction(async (tx) => {
      const prev = await tx.cases.findUnique({ where: { id: caseId } });

      const updated = await tx.cases.update({
        where: { id: caseId },
        data: { status_id: nextStatusId },
      });

      await tx.caseHistories.create({
        data: {
          case_id: caseId,
          changed_by: changedBy,
          field: "status_id",
          old_value: String(prev?.status_id),
          new_value: String(nextStatusId),
        },
      });

      return updated;
    });
  }
  /* ───────────── ARCHIVE ───────────── */
  async archiveCase(id: number, userId: number) {
    return prisma.$transaction(async (tx) => {
      await tx.caseHistories.create({
        data: {
          case_id: id,
          changed_by: userId,
          field: "archived",
          old_value: "false",
          new_value: "true",
          note: "Soft delete",
        },
      });

      return tx.cases.update({
        where: { id },
        data: { is_public: false, archived: true },
      });
    });
  }

  async archiveAttachment(attId: number, userId: number) {
    return prisma.$transaction(async (tx) => {
      const attachment = await tx.attachments.findUnique({
        where: { id: attId },
      });
      if (!attachment) throw new Error("Attachment no encontrado");

      const archived = await tx.attachments.update({
        where: { id: attId },
        data: { archived: true },
      });

      await tx.caseHistories.create({
        data: {
          case_id: archived.service_id,
          changed_by: userId,
          field: "attachment_archived",
          old_value: "false",
          new_value: "true",
          note: `Attachment ${attId} archived`,
        },
      });

      return archived;
    });
  }
  /* ───────────── FIND BY USER & STATUS ───────────── */
  async findCasesByUserAndStatus(params: {
    userId: number;
    role: "client" | "lawyer";
    status_id: number;
  }) {
    const allStatuses = await prisma.caseStatuses.findMany({
      orderBy: { id: "asc" },
    });
    if (allStatuses.length === 0) {
      throw new Error("No hay estados configurados en caseStatuses.");
    }
    const finalArchiveId = allStatuses[allStatuses.length - 1].id;

    const whereService =
      params.role === "client"
        ? { service: { client_id: params.userId } }
        : { service: { lawyer_id: params.userId } };

    return prisma.cases.findMany({
      where: {
        ...whereService,
        status_id: params.status_id,
        archived: params.status_id === finalArchiveId,
      },
      orderBy: { created_at: "desc" },
    });
  }
  /* ───────────── LISTAR CASOS ARCHIVADOS ───────────── */
  async findCasesByUserAndArchived(userId: number, role: "client" | "lawyer") {
    const whereService =
      role === "client"
        ? { service: { client_id: userId } }
        : { service: { lawyer_id: userId } };

    return prisma.cases.findMany({
      where: {
        ...whereService,
        archived: true,
      },
      orderBy: { created_at: "desc" },
    });
  }
  /* ───────────── RESTAURAR CASO ARCHIVADO ───────────── */
  async restoreCase(id: number, userId: number) {
    return prisma.$transaction(async (tx) => {
      await tx.caseHistories.create({
        data: {
          case_id: id,
          changed_by: userId,
          field: "archived",
          old_value: "true",
          new_value: "false",
          note: "Case reopened",
        },
      });

      return tx.cases.update({
        where: { id },
        data: { archived: false },
      });
    });
  }
}
