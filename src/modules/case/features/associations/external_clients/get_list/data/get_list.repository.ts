// src/modules/case/features/associations/external_clients/get_list/data/get_list.repository.ts
import prisma from "../../../../../../../config/prisma_client";

export const getExternalClientsRepository = {
  countByLawyer(userDetailId: string, q?: string) {
    return prisma.external_clients.count({
      where: {
        user_detail_id: userDetailId,
        archived: false,
        ...(q
          ? {
              OR: [
                { full_name: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
                { phone: { contains: q, mode: "insensitive" } },
                { dni: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
    });
  },

  findManyByLawyer(
    userDetailId: string,
    skip: number,
    take: number,
    q?: string
  ) {
    return prisma.external_clients.findMany({
      where: {
        user_detail_id: userDetailId,
        archived: false,
        ...(q
          ? {
              OR: [
                { full_name: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
                { phone: { contains: q, mode: "insensitive" } },
                { dni: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { created_at: "desc" },
      skip,
      take,
    });
  },
};
