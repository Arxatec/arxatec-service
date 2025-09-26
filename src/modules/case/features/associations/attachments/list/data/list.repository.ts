// src/modules/cases/features/associations/attachments/list/data/list.repository.ts
import prisma from "../../../../../../../config/prisma_client";

export class ListAttachmentRepository {
  findCaseById(caseId: string) {
    return prisma.cases.findUnique({
      where: { id: caseId },
      include: { service: true },
    });
  }

  countByServiceId(serviceId: string) {
    return prisma.attachments.count({
      where: { service_id: serviceId, archived: false },
    });
  }

  findByServiceId(serviceId: string, skip: number, take: number) {
    return prisma.attachments.findMany({
      where: { service_id: serviceId, archived: false },
      orderBy: { created_at: "asc" },
      skip,
      take,
    });
  }
}
