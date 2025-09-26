// src/modules/case/features/associations/external_clients/get_archived/data/get_archived.repository.ts
import prisma from "../../../../../../../config/prisma_client";

export const getArchivedExternalClientsRepository = {
  findManyByLawyer(userDetailId: string) {
    return prisma.external_clients.findMany({
      where: { user_detail_id: userDetailId, archived: true },
      orderBy: { created_at: "desc" },
    });
  },
};
