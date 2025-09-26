// modules/cases/feature/shared/catalog/catalog.repository.ts
import prisma from "../../../../../config/prisma_client";

export class CatalogRepository {
  getAllStatuses() {
    return prisma.case_statuses.findMany({
      orderBy: { name: "asc" },
    });
  }

  getAllCategories() {
    return prisma.case_categories.findMany({
      orderBy: { name: "asc" },
    });
  }

  getStatusById(id: string) {
    return prisma.case_statuses.findUnique({
      where: { id },
    });
  }

  getCategoryById(id: string) {
    return prisma.case_categories.findUnique({
      where: { id },
    });
  }
}
