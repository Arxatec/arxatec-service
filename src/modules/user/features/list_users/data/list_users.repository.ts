// src/modules/user/features/list_users/data/list_users.repository.ts
import prisma from "../../../../../config/prisma_client";

export class ListUsersRepository {
  count(q?: string) {
    return prisma.users.count({
      where: q
        ? {
            OR: [
              { first_name: { contains: q, mode: "insensitive" } },
              { last_name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          }
        : undefined,
    });
  }

  listMany(skip: number, take: number, q?: string) {
    return prisma.users.findMany({
      where: q
        ? {
            OR: [
              { first_name: { contains: q, mode: "insensitive" } },
              { last_name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          }
        : undefined,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
      },
      orderBy: [{ last_name: "asc" }, { first_name: "asc" }],
      skip,
      take,
    });
  }
}
