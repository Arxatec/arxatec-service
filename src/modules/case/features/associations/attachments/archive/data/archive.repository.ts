// src/modules/cases/features/associations/attachments/archive/data/archive.repository.ts
import prisma from "../../../../../../../config/prisma_client";

export class ArchiveAttachmentRepository {
  findCaseById(caseId: string) {
    return prisma.cases.findUnique({
      where: { id: caseId },
      include: { service: true },
    });
  }

  findAttachmentByServiceIdAndId(attId: string, serviceId: string) {
    return prisma.attachments.findFirst({
      where: { id: attId, service_id: serviceId },
    });
  }

  archiveAttachment(attId: string) {
    return prisma.attachments.update({
      where: { id: attId },
      data: { archived: true },
    });
  }

  createArchiveHistory(caseId: string, userId: string, attId: string) {
    return prisma.case_histories.create({
      data: {
        case_id: caseId,
        changed_by: userId,
        field: "attachment_archived",
        old_value: "false",
        new_value: "true",
        note: `Attachment ${attId} archived`,
      },
    });
  }
}
