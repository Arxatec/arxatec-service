// src/modules/cases/features/manage/change_status/data/change_status.repository.ts
import prisma from "../../../../../../config/prisma_client";

export type FoundCase = {
  id: string;
  status: import("@prisma/client").case_status;
  archived: boolean;
  service_id: string;
  service: { lawyer_id: string | null } | null;
};

export async function findCaseById(id: string): Promise<FoundCase | null> {
  return prisma.cases.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      archived: true,
      service_id: true,
      service: { select: { lawyer_id: true } },
    },
  });
}

export async function countLawyerCasesByStatus(params: {
  lawyerId: string;
  status: import("@prisma/client").case_status;
  excludeExternal?: boolean;
}) {
  return prisma.cases.count({
    where: {
      status: params.status,
      archived: false,
      service: {
        lawyer_id: params.lawyerId,
        ...(params.excludeExternal ? { external_client_id: null } : {}),
      },
    },
  });
}

export async function assignLawyerToService(
  serviceId: string,
  lawyerId: string
) {
  return prisma.services.update({
    where: { id: serviceId },
    data: { lawyer_id: lawyerId },
  });
}

export async function unassignLawyerFromService(serviceId: string) {
  return prisma.services.update({
    where: { id: serviceId },
    data: { lawyer_id: null },
  });
}

export async function changeStatusTx(params: {
  caseId: string;
  newStatus: import("@prisma/client").case_status;
  changedBy: string;
  oldStatus: import("@prisma/client").case_status;
  note?: string;
}) {
  const { caseId, newStatus, changedBy, oldStatus, note } = params;

  return prisma.$transaction(async (tx) => {
    const isPrivate = newStatus === "in_progress";
    await tx.cases.update({
      where: { id: caseId },
      data: { status: newStatus, is_public: !isPrivate },
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
