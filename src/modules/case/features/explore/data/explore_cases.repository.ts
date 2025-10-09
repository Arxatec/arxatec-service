// src/modules/case/features/explore_cases/data/explore_cases.repository.ts
import { case_category, case_status } from "@prisma/client";
import prisma from "../../../../../config/prisma_client";

export type Filters = {
  category?: case_category;
  is_public?: boolean;
  archived?: boolean;
  lawyerId?: string | null;
  search?: string;
};

export function count(filters: Filters) {
  const where = buildWhere(filters);
  return prisma.cases.count({ where });
}

export function find(filters: Filters, skip: number, take: number) {
  const where = buildWhere(filters);
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

export function getAllCategories() {
  return Object.values(case_category).map((value) => ({ value }));
}

export function getAllStatuses() {
  return Object.values(case_status).map((value) => ({ value }));
}

function buildWhere(filters: Filters) {
  const { category, is_public, archived = false, lawyerId, search } = filters;
  return {
    archived,
    status: case_status.en_progreso, // Solo casos en progreso
    ...(category ? { category } : {}),
    ...(is_public !== undefined ? { is_public } : {}),
    ...(lawyerId !== undefined
      ? { service: { lawyer_id: lawyerId ?? undefined } }
      : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };
}
