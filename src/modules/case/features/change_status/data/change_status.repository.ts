import { PrismaClient } from "@prisma/client";
import { CatalogRepository } from "../../shared/catalog/catalog.repository";

const prisma = new PrismaClient();

export class ChangeStatusRepository {
  private catalogRepo = new CatalogRepository();

  findCaseById(id: number) {
    return prisma.cases.findUnique({
      where: { id },
      include: {
        service: true,
        status: true,
      },
    });
  }

  getAllStatuses() {
    return this.catalogRepo.getAllStatuses();
  }

  countLawyerCasesByStatus(params: {
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

  assignLawyerToService(serviceId: number, lawyerId: number) {
    return prisma.services.update({
      where: { id: serviceId },
      data: { lawyer_id: lawyerId },
    });
  }

  unassignLawyerFromService(serviceId: number) {
    return prisma.services.update({
      where: { id: serviceId },
      data: { lawyer_id: null },
    });
  }

  async changeStatus(
    caseId: number,
    newStatusId: number,
    changedBy: number,
    oldStatus: string,
    newStatus: string,
    note?: string
  ) {
    return prisma.$transaction(async (tx) => {
      const isPrivate = newStatus === "En revisión" || newStatus === "Tomado";
      await tx.cases.update({
        where: { id: caseId },
        data: {
          status_id: newStatusId,
          is_public: !isPrivate,
        },
      });

      await tx.caseHistories.create({
        data: {
          case_id: caseId,
          changed_by: changedBy,
          field: "status",
          old_value: oldStatus,
          new_value: newStatus,
          ...(note && { note }),
        },
      });
    });
  }
}