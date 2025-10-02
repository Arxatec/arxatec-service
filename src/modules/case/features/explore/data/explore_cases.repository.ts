// src/modules/case/features/explore_cases/data/explore_cases.repository.ts
import { case_category, case_status } from "@prisma/client";
import prisma from "../../../../../config/prisma_client";
import { CatalogRepository } from "../../shared/catalog/catalog.repository";

type Filters = {
  category?: string;
  status?: string;
  is_public?: boolean;
  archived?: boolean;
  lawyerId?: string | null;
  search?: string;
};

export class ExploreCasesRepository {
  private catalogRepo = new CatalogRepository();

  getAllCategories() {
    return this.catalogRepo.getAllCategories();
  }

  getAllStatuses() {
    return this.catalogRepo.getAllStatuses();
  }

  count(filters: Filters) {
    const where = this.buildWhere(filters);
    return prisma.cases.count({ where });
  }

  find(filters: Filters, skip: number, take: number) {
    const where = this.buildWhere(filters);
    return prisma.cases.findMany({
      where,
      select: {
        id: true,
        title: true,
        status: true,
        category: true,
        is_public: true,
        created_at: true,
        description: true,
      },
      orderBy: { created_at: "desc" },
      skip,
      take,
    });
  }

  private buildWhere(filters: Filters) {
    const {
      category,
      status,
      is_public,
      archived = false,
      lawyerId,
      search,
    } = filters;
    return {
      archived,
      ...(category ? { category: category as case_category } : {}),
      ...(status ? { status: status as case_status } : {}),
      ...(is_public !== undefined ? { is_public } : {}),
      ...(lawyerId !== undefined
        ? { service: { lawyer_id: lawyerId ?? undefined } }
        : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" as const } },
              {
                description: { contains: search, mode: "insensitive" as const },
              },
            ],
          }
        : {}),
    };
  }
}
