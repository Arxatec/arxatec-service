// src/modules/case/data/repository/cases.repositoryts
import { PrismaClient, Prisma, Attachments } from "@prisma/client";

const prisma = new PrismaClient();

export class CasesRepository {
  /* ───────────── CATALOGOS ───────────── */
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

  /* ───────────── CREATE ───────────── */
  async createService(data: Prisma.ServicesCreateInput) {
    return prisma.services.create({ data });
  }

  async createCase(data: Prisma.CasesCreateInput) {
    return prisma.cases.create({ data });
  }

  async createExternalClient(data: Prisma.ExternalClientsCreateInput) {
    return prisma.externalClients.create({ data });
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

  /* ───────────── READ ───────────── */
  async findExternalClientById(id: number) {
    return prisma.externalClients.findUnique({ where: { id } });
  }

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

  async getCaseHistory(caseId: number) {
    return prisma.caseHistories.findMany({
      where: { case_id: caseId },
      orderBy: { created_at: "desc" },
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
  async findAttachmentsByServiceId(serviceId: number) {
    return prisma.attachments.findMany({
      where: { service_id: serviceId, archived: false },
      orderBy: { created_at: "asc" },
    });
  }
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
 /* ───────────── ASSIGN LAWYER ───────────── */
  async assignLawyerToService(serviceId: number, lawyerId: number) {
    return prisma.services.update({
      where: { id: serviceId },
      data:  { lawyer_id: lawyerId },
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

  /* ───────────── AGGREGATE ───────────── */
  countCasesByLawyer(params: { lawyerId: number; status_id: number }) {
    return prisma.cases.count({
      where: {
        service: { lawyer_id: params.lawyerId },
        status_id: params.status_id,
        archived: false,
      },
    });
  }
}
