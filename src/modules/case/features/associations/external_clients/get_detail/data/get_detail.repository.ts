// src/modules/case/features/associations/external_clients/get_detail/data/get_detail.repository.ts
import prisma from "../../../../../../../config/prisma_client";

export const getExternalClientDetailRepository = {
  findByIdAndLawyer(id: string, userDetailId: string) {
    return prisma.external_clients.findFirst({
      where: { id, user_detail_id: userDetailId },
    });
  },
};
