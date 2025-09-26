// src/modules/cases/features/manage/change_status/data/change_status.repository.ts
import prisma from "../../../../../../config/prisma_client";
import { CatalogRepository } from "../../../shared/catalog/catalog.repository";

export class ChangeStatusRepository {
  private catalogRepo = new CatalogRepository();

  findCaseById(id: string) {
    return prisma.cases.findUnique({
      where: { id },
      include: { service: true, status: true },
    });
  }

  getAllStatuses() {
    return this.catalogRepo.getAllStatuses();
  }

  countLawyerCasesByStatus(params: {
    lawyerId: string;
    status_id: string;
    excludeExternal?: boolean;
  }) {
    return prisma.cases.count({
      where: {
        status_id: params.status_id,
        archived: false,
        service: {
          lawyer_id: params.lawyerId,
          ...(params.excludeExternal ? { external_client_id: null } : {}),
        },
      },
    });
  }

  assignLawyerToService(serviceId: string, lawyerId: string) {
    return prisma.services.update({
      where: { id: serviceId },
      data: { lawyer_id: lawyerId },
    });
  }

  unassignLawyerFromService(serviceId: string) {
    return prisma.services.update({
      where: { id: serviceId },
      data: { lawyer_id: null },
    });
  }

  async changeStatus(
    caseId: string,
    newStatusId: string,
    changedBy: string,
    oldStatus: string,
    newStatus: string,
    note?: string
  ) {
    return prisma.$transaction(async (tx) => {
      const isPrivate = ["en revisión", "tomado"].includes(newStatus.toLowerCase());
      await tx.cases.update({
        where: { id: caseId },
        data: { status_id: newStatusId, is_public: !isPrivate },
      });

      await tx.case_histories.create({
        data: {
          case_id: caseId,
          changed_by: changedBy,
          field: "status",
          old_value: oldStatus,
          new_value: newStatus,
          ...(note ? { note } : {}),
        },
      });
    });
  }
}
