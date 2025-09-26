// src/modules/cases/features/associations/attachments/create/data/create.repository.ts
import prisma from "../../../../../../../config/prisma_client";

export class CreateAttachmentRepository {
  findCaseById(caseId: string) {
    return prisma.cases.findUnique({
      where: { id: caseId },
      include: { service: true },
    });
  }

  async addAttachment(data: {
    caseId: string;
    category_id: string;
    label: string;
    description?: string;
    file_key: string;
    uploaded_by: "client" | "lawyer";
  }) {
    const caseRecord = await prisma.cases.findUnique({
      where: { id: data.caseId },
      select: { service_id: true },
    });
    if (!caseRecord) return null;

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
}
