// src/modules/case/features/associations/external_clients/restore/data/restore.repository.ts
import prisma from "../../../../../../../config/prisma_client";

export function findByIdAndLawyer(id: string, userDetailId: string) {
  return prisma.external_clients.findFirst({
    where: { id, user_detail_id: userDetailId },
  });
}

export function restoreExternalClient(id: string) {
  return prisma.external_clients.update({
    where: { id },
    data: { archived: false },
  });
}
