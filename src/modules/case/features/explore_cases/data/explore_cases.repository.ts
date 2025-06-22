import { PrismaClient, Prisma } from "@prisma/client";
import { CatalogRepository } from "../../shared/catalog/catalog.repository";

export class ExploreCasesRepository {
  private prisma = new PrismaClient();
  private catalogRepo = new CatalogRepository();

  getAllCategories() {
    return this.catalogRepo.getAllCategories();
  }

  getAllStatuses() {
    return this.catalogRepo.getAllStatuses();
  }

  exploreCases(filters: {
    category_id?: number;
    status_id?: number;
    is_public?: boolean;
    archived?: boolean;
    lawyerId?: number | null;
  }) {
    const { category_id, status_id, is_public, archived = false, lawyerId } =
      filters;

    const where: Prisma.CasesWhereInput = {
      archived,
      ...(category_id && { category_id }),
      ...(status_id && { status_id }),
      ...(is_public !== undefined && { is_public }),
      ...(lawyerId !== undefined && { service: { lawyer_id: lawyerId } }),
    };

    return this.prisma.cases.findMany({
      where,
      orderBy: { created_at: "desc" },
    });
  }
}
