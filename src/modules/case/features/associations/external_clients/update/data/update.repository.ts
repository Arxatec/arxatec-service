// src/modules/case/features/associations/external_clients/update/data/update.repository.ts
import prisma from "../../../../../../../config/prisma_client";
import { Prisma, external_clients } from "@prisma/client";

export class UpdateExternalClientRepository {
  findByIdAndLawyer(
    id: string,
    userDetailId: string,
    includeArchived = false
  ): Promise<external_clients | null> {
    return prisma.external_clients.findFirst({
      where: {
        id,
        user_detail_id: userDetailId,
        ...(includeArchived ? {} : { archived: false }),
      },
    });
  }

  update(
    id: string,
    data: Prisma.external_clientsUpdateInput
  ): Promise<external_clients> {
    return prisma.external_clients.update({ where: { id }, data });
  }
}
