// src/modules/cases/features/manage/create_case/data/create_case.repository.ts
import prisma from "../../../../../../config/prisma_client";
import { Prisma } from "@prisma/client";

export class CreateCaseRepository {
  createService(data: Prisma.servicesCreateInput) {
    return prisma.services.create({ data });
  }

  createCase(data: Prisma.casesCreateInput) {
    return prisma.cases.create({ data });
  }

  findExternalClientByIdForLawyer(externalClientId: string, userId: string) {
    return prisma.external_clients.findFirst({
      where: {
        id: externalClientId,
        user_detail_id: userId,
        archived: false,
      },
    });
  }
}
