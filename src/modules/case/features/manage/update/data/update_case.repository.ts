// src/modules/cases/features/manage/update_case/data/update_case.repository.ts
import prisma from "../../../../../../config/prisma_client";
import { Prisma, case_status } from "@prisma/client";

export function getCaseById(caseId: string) {
  return prisma.cases.findUnique({
    where: { id: caseId },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      urgency: true,
      status: true,
      is_public: true,
      archived: true,
      reference_code: true,
      service: { select: { id: true, client_id: true, lawyer_id: true } },
    },
  });
}

export async function updateCaseAtomic(args: {
  caseId: string;
  serviceId: string;
  updatesCase: Prisma.casesUpdateInput;
  assignLawyerUserId?: string;
  externalClientId?: string;
  makePrivateAndTaken?: boolean;
  takenStatus?: case_status;
}) {
  const {
    caseId,
    serviceId,
    updatesCase,
    assignLawyerUserId,
    externalClientId,
    makePrivateAndTaken,
    takenStatus,
  } = args;

  return prisma.$transaction(async (tx) => {
    if (makePrivateAndTaken && assignLawyerUserId && takenStatus) {
      await tx.services.update({
        where: { id: serviceId },
        data: { lawyer: { connect: { user_id: assignLawyerUserId } } },
      });
      Object.assign(updatesCase, { is_public: false, status: takenStatus });
    }

    if (externalClientId) {
      await tx.services.update({
        where: { id: serviceId },
        data: { external_client: { connect: { id: externalClientId } } },
      });
    }

    return tx.cases.update({ where: { id: caseId }, data: updatesCase });
  });
}

export function lawyerOwnsExternalClient(
  externalClientId: string,
  lawyerUserId: string
) {
  return prisma.external_clients.findFirst({
    where: {
      id: externalClientId,
      user_detail_id: lawyerUserId,
      archived: false,
    },
  });
}
