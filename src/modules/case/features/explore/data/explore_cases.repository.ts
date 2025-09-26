// src/modules/case/features/explore_cases/data/explore_cases.repository.ts
import prisma from "../../../../../config/prisma_client";
import { CatalogRepository } from "../../shared/catalog/catalog.repository";

type Filters = {
  category_id?: string;
  status_id?: string;
  is_public?: boolean;
  archived?: boolean;
  lawyerId?: string | null;
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
      orderBy: { created_at: "desc" },
      skip,
      take,
      include: {
        category: true,
        status: true,
        service: { select: { lawyer_id: true, client_id: true } },
      },
    });
  }

  private buildWhere(filters: Filters) {
    const { category_id, status_id, is_public, archived = false, lawyerId } = filters;
    return {
      archived,
      ...(category_id ? { category_id } : {}),
      ...(status_id ? { status_id } : {}),
      ...(is_public !== undefined ? { is_public } : {}),
      ...(lawyerId !== undefined ? { service: { lawyer_id: lawyerId ?? undefined } } : {}),
    };
  }
}
