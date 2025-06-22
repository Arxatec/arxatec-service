// modules/cases/feature/shared/catalog/catalog.repository.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class CatalogRepository {
  getAllStatuses() {
    return prisma.caseStatuses.findMany({ orderBy: { id: "asc" } });
  }

  getAllCategories() {
    return prisma.caseCategories.findMany({ orderBy: { name: "asc" } });
  }

  getStatusById(id: number) {
    return prisma.caseStatuses.findUnique({ where: { id } });
  }

  getCategoryById(id: number) {
    return prisma.caseCategories.findUnique({ where: { id } });
  }
}
