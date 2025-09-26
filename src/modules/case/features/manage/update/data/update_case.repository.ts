// src/modules/cases/features/manage/update_case/data/update_case.repository.ts
import prisma from "../../../../../../config/prisma_client";
import { Prisma } from "@prisma/client";
import { CatalogRepository } from "../../../shared/catalog/catalog.repository";

export class UpdateCaseRepository {
  private readonly catalog = new CatalogRepository();

  getById(caseId: string) {
    return prisma.cases.findUnique({
      where: { id: caseId },
      include: { service: true, category: true, status: true },
    });
  }

  getAllStatuses() {
    return this.catalog.getAllStatuses();
  }

  getAllCategories() {
    return this.catalog.getAllCategories();
  }

  update(caseId: string, data: Prisma.casesUpdateInput) {
    return prisma.cases.update({ where: { id: caseId }, data });
  }
}
