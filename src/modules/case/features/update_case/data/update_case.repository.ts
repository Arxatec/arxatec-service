// src/modules/cases/features/update_case/data/update_case.repository.ts
import { PrismaClient, Prisma } from "@prisma/client";
import { CatalogRepository } from "../../shared/catalog/catalog.repository";

const prisma = new PrismaClient();

export class UpdateCaseRepository {
  private readonly catalog = new CatalogRepository();

  getById(caseId: number) {
    return prisma.cases.findUnique({
      where: { id: caseId },
      include: {
        service: true,
        category: true,
        status: true,
      },
    });
  }

  getAllStatuses() {
    return this.catalog.getAllStatuses();
  }

  getAllCategories() {
    return this.catalog.getAllCategories();
  }

  update(caseId: number, data: Prisma.CasesUpdateInput) {
    return prisma.cases.update({
      where: { id: caseId },
      data,
    });
  }
}
