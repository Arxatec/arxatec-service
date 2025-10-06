// src/modules/case/features/associations/external_clients/update/data/update.repository.ts
import prisma from "../../../../../../../config/prisma_client";
import { Prisma } from "@prisma/client";

export function findByIdAndLawyer(
  id: string,
  userDetailId: string,
  includeArchived = false
) {
  return prisma.external_clients.findFirst({
    where: {
      id,
      user_detail_id: userDetailId,
      ...(includeArchived ? {} : { archived: false }),
    },
  });
}

export function updateExternalClient(
  id: string,
  data: Prisma.external_clientsUpdateInput
) {
  return prisma.external_clients.update({ where: { id }, data });
}
