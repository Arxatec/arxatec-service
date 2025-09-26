// src/modules/cases/features/manage/case_detail/data/case_detail.repository.ts
import prisma from "../../../../../../config/prisma_client";

export class CaseDetailRepository {
  getById(id: string) {
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
}
