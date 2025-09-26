// src/modules/case/features/associations/external_clients/archive/data/archive.repository.ts
import prisma from "../../../../../../../config/prisma_client";

export const archiveExternalClientRepository = {
  findByIdAndLawyer(id: string, userDetailId: string, includeArchived = false) {
    return prisma.external_clients.findFirst({
      where: { id, user_detail_id: userDetailId, archived: includeArchived },
    });
  },
  archive(id: string) {
    return prisma.external_clients.update({
      where: { id },
      data: { archived: true },
    });
  },
};
