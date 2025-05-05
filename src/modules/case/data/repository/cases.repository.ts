// src/modules/case/data/repository/cases.repository.ts
import {
  Prisma,
  PrismaClient,
  case_status,
  case_category,
  case_type,
} from "@prisma/client";

const prisma = new PrismaClient();

export class CasesRepository {
  /* ─────────────── CREATE ─────────────── */

  async createCase(data: Prisma.CaseCreateInput) {
    return prisma.case.create({ data });
  }

  async createExternalClient(
    data: Prisma.ExternalClientCreateInput,
    lawyerId: number
  ) {
    return prisma.externalClient.create({
      data: {
        ...data,
        lawyer: { connect: { id: lawyerId } },
      },
    });
  }

  async findExternalClientById(id: number) {
    return prisma.externalClient.findUnique({
      where: { id },
    });
  }
  async addAttachment(data: Prisma.CaseAttachmentCreateInput) {
    return prisma.caseAttachment.create({ data });
  }

  /* ─────────────── READ ─────────────── */

  async findById(id: number) {
    return prisma.case.findUnique({
      where: { id },
      include: {
        attachments: { where: { archived: false } },
        messages: true,
        histories: true,
        externalClient: true,
      },
    });
  }

  async findMyCases(userId: number, role: "client" | "lawyer") {
    const where =
      role === "client"
        ? { client_id: userId, archived: false }
        : { lawyer_id: userId, archived: false };

    return prisma.case.findMany({
      where,
      orderBy: { created_at: "desc" },
    });
  }

  async exploreCases(
    role: "client" | "lawyer",
    filters: {
      category?: case_category;
      type?: case_type;
      status?: case_status | case_status[];
      isPublic?: boolean;
      archived?: boolean;
      lawyerId?: number | null;
    } = {}
  ) {
    const {
      category,
      type,
      status,
      isPublic,
      archived = false,
      lawyerId,
    } = filters;

    const where: Prisma.CaseWhereInput = {
      archived,
      ...(category && { category }),
      ...(type && { type }),
      ...(Array.isArray(status)
        ? { status: { in: status } }
        : status && { status }),
      ...(role === "client"
        ? { is_public: true }
        : {
            OR: [
              { is_public: true }, // públicos
              { lawyer_id: null }, // privados sin tomar
            ],
          }),
      ...(isPublic !== undefined && { is_public: isPublic }),
      ...(lawyerId !== undefined && { lawyer_id: lawyerId }),
    };

    return prisma.case.findMany({
      where,
      orderBy: { created_at: "desc" },
    });
  }

  /* ─────────────── UPDATE ─────────────── */

  async updateCase(id: number, data: Prisma.CaseUpdateInput) {
    return prisma.case.update({ where: { id }, data });
  }

  async changeStatus(
    id: number,
    nextStatus: case_status,
    changedBy: number,
    lawyerId?: number | null
  ) {
    return prisma.$transaction(async (tx) => {
      const previous = await tx.case.findUnique({ where: { id } });
      const updated = await tx.case.update({
        where: { id },
        data: {
          status: nextStatus,
          ...(nextStatus === "taken" && { lawyer_id: lawyerId }),
        },
      });

      await tx.caseHistory.create({
        data: {
          case_id: id,
          changed_by: changedBy,
          field: "status",
          old_value: previous?.status,
          new_value: nextStatus,
        },
      });

      return updated;
    });
  }

  async archiveCase(id: number, userId: number) {
    return prisma.$transaction(async (tx) => {
      await tx.caseHistory.create({
        data: {
          case_id: id,
          changed_by: userId,
          field: "archived",
          old_value: "false",
          new_value: "true",
        },
      });

      return tx.case.update({
        where: { id },
        data: { archived: true, status: "archived" },
      });
    });
  }

  async archiveAttachment(attId: number, userId: number) {
    return prisma.$transaction(async (tx) => {
      const archived = await tx.caseAttachment.update({
        where: { id: attId },
        data: { archived: true },
      });

      await tx.caseHistory.create({
        data: {
          case_id: archived.case_id,
          changed_by: userId,
          field: "attachment_archived",
          old_value: "false",
          new_value: "true",
        },
      });

      return archived;
    });
  }
  async createMessage(data: Prisma.CaseMessageCreateInput) {
    return prisma.caseMessage.create({ data });
  }

  async getCaseHistory(caseId: number) {
    return prisma.caseHistory.findMany({
      where: { case_id: caseId },
      orderBy: { created_at: "desc" },
    });
  }
}
