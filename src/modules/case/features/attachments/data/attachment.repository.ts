// src/modules/cases/features/attachments/data/attachment.repository.ts
import { PrismaClient } from "@prisma/client";
import { AppError } from "../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../constants/http_status_codes";

const prisma = new PrismaClient();

export class AttachmentRepository {
  findCaseById(id: number) {
    return prisma.cases.findUnique({
      where: { id },
      include: { service: true },
    });
  }
  async addAttachment(data: {
    caseId: number;
    category_id: number;
    label: string;
    description?: string;
    file_key: string;
    uploaded_by: "client" | "lawyer";
  }) {
    const caseRecord = await prisma.cases.findUnique({
      where: { id: data.caseId },
      select: { service_id: true },
    });

    if (!caseRecord) {
      throw new AppError("Case not found", HttpStatusCodes.NOT_FOUND.code);
    }

    return prisma.attachments.create({
      data: {
        service: { connect: { id: caseRecord.service_id } },
        category: { connect: { id: data.category_id } },
        label: data.label,
        description: data.description,
        file_key: data.file_key,
        uploaded_by: data.uploaded_by,
      },
    });
  }

  async findAttachmentsByServiceId(serviceId: number) {
    return prisma.attachments.findMany({
      where: {
        service_id: serviceId,
        archived: false,
      },
      orderBy: { created_at: "asc" },
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

  async archiveAttachment(attId: number, userId: number) {
    return prisma.$transaction(async (tx) => {
      const attachment = await tx.attachments.findUnique({
        where: { id: attId },
      });

      if (!attachment) {
        throw new AppError(
          "Attachment not found",
          HttpStatusCodes.NOT_FOUND.code
        );
      }

      const updated = await tx.attachments.update({
        where: { id: attId },
        data: { archived: true },
      });

      await tx.caseHistories.create({
        data: {
          case_id: updated.service_id,
          changed_by: userId,
          field: "attachment_archived",
          old_value: "false",
          new_value: "true",
          note: `Attachment ${attId} archived`,
        },
      });

      return updated;
    });
  }
}
