// src/modules/cases/features/create_case/data/create_case.repository.ts
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class CreateCaseRepository {
  createService(data: Prisma.ServicesCreateInput) {
    return prisma.services.create({ data });
  }

  createCase(data: Prisma.CasesCreateInput) {
    return prisma.cases.create({ data });
  }

  findExternalClientByIdForLawyer(externalClientId: number, userId: number) {
    return prisma.externalClients.findFirst({
      where: {
        id: externalClientId,
        user_detail_id: userId,
        archived: false,
      },
    });
  }
}
