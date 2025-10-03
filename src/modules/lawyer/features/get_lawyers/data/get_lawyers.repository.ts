// src/modules/lawyer/features/get_lawyers/data/get_lawyers.repository.ts
import prisma from "../../../../../config/prisma_client";

type Filters = {
  search?: string;
};

export class GetLawyersRepository {
  private buildWhere(filters: Filters) {
    const { search } = filters;

    return {
      user_type: "lawyer" as any,
      ...(search
        ? {
            OR: [
              { first_name: { contains: search, mode: "insensitive" as const } },
              { last_name:  { contains: search, mode: "insensitive" as const } },
              { email:      { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };
  }

  count(filters: Filters) {
    const where = this.buildWhere(filters);
    return prisma.users.count({ where });
  }

  find(filters: Filters, skip: number, take: number) {
    const where = this.buildWhere(filters);
    return prisma.users.findMany({
      where,
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
}
