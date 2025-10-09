// src/modules/case/features/associations/external_clients/get_list/data/get_list.repository.ts
import prisma from "../../../../../../../config/prisma_client";

export function countByLawyer(userDetailId: string, search?: string) {
  return prisma.external_clients.count({
    where: {
      user_detail_id: userDetailId,
      archived: false,
      ...(search
        ? {
            OR: [
              { full_name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { phone: { contains: search, mode: "insensitive" } },
              { dni: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
  });
}

export function findManyByLawyer(
  userDetailId: string,
  skip: number,
  take?: number,
  search?: string
) {
  return prisma.external_clients.findMany({
    where: {
      user_detail_id: userDetailId,
      archived: false,
      ...(search
        ? {
            OR: [
              { full_name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { phone: { contains: search, mode: "insensitive" } },
              { dni: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { created_at: "desc" },
    skip,
    take: take ?? undefined,
  });
}
