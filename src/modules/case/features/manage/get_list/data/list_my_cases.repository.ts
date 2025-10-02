import { case_category, case_status } from "@prisma/client";
import prisma from "../../../../../../config/prisma_client";

export class ListMyCasesRepository {
  count(
    userId: string,
    role: "client" | "lawyer",
    filters: { search?: string; category?: string; status?: string }
  ) {
    return prisma.cases.count({
      where: {
        archived: false,
        service:
          role === "client" ? { client_id: userId } : { lawyer_id: userId },
        ...(filters.search && {
          title: {
            contains: filters.search,
            mode: "insensitive" as const,
          },
        }),
        ...(filters.category && {
          category: filters.category as case_category,
        }),
        ...(filters.status && {
          status: filters.status as case_status,
        }),
      },
    });
  }

  find(
    userId: string,
    role: "client" | "lawyer",
    skip: number,
    take: number,
    filters: { search?: string; category?: string; status?: string }
  ) {
    return prisma.cases.findMany({
      where: {
        archived: false,
        service:
          role === "client" ? { client_id: userId } : { lawyer_id: userId },
        ...(filters.search && {
          title: {
            contains: filters.search,
            mode: "insensitive" as const,
          },
        }),
        ...(filters.category && {
          category: filters.category as case_category,
        }),
        ...(filters.status && {
          status: filters.status as case_status,
        }),
      },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        category: true,
        is_public: true,
        created_at: true,
        description: true,
      },

      skip,
      take,
    });
  }
}
