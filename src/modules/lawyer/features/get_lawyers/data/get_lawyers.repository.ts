// src/modules/lawyer/features/get_lawyers/data/get_lawyers.repository.ts
import prisma from "../../../../../config/prisma_client";

type Filters = { search?: string };

function buildWhere(filters: Filters) {
  const { search } = filters;
  return {
    user_type: "lawyer" as const,
    ...(search
      ? {
          OR: [
            { first_name: { contains: search, mode: "insensitive" as const } },
            { last_name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };
}

export async function countLawyers(filters: Filters) {
  return prisma.users.count({ where: buildWhere(filters) });
}

export async function findLawyers(
  filters: Filters,
  skip: number,
  take: number
) {
  return prisma.users.findMany({
    where: buildWhere(filters),
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
      profile_image: true,
      lawyer_details: true,
    },
    orderBy: { last_name: "asc" },
    skip,
    take,
  });
}
