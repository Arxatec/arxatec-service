// src/modules/case/features/associations/external_clients/create/data/create.repository.ts
import prisma from "../../../../../../../config/prisma_client";
import { Prisma, external_clients } from "@prisma/client";

export class CreateExternalClientRepository {
  create(data: Prisma.external_clientsCreateInput): Promise<external_clients> {
    return prisma.external_clients.create({ data });
  }
}
