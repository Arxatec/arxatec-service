// src/modules/cases/features/manage/list_my_cases/data/list_my_cases.repository.ts
import { case_category, case_status } from "@prisma/client";
import prisma from "../../../../../../config/prisma_client";

type Filters = { search?: string; category?: string; status?: string };

export function countMyCases(
  userId: string,
  role: "client" | "lawyer",
  filters: Filters
) {
  return prisma.cases.count({
    where: {
      archived: false,
      service:
        role === "client" ? { client_id: userId } : { lawyer_id: userId },
      ...(filters.search && {
        title: { contains: filters.search, mode: "insensitive" as const },
      }),
      ...(filters.category && { category: filters.category as case_category }),
      ...(filters.status && { status: filters.status as case_status }),
    },
  });
}

export function findMyCases(
  userId: string,
  role: "client" | "lawyer",
  skip: number,
  take: number,
  filters: Filters
) {
  return prisma.cases.findMany({
    where: {
      archived: false,
      service:
        role === "client" ? { client_id: userId } : { lawyer_id: userId },
      ...(filters.search && {
        title: { contains: filters.search, mode: "insensitive" as const },
      }),
      ...(filters.category && { category: filters.category as case_category }),
      ...(filters.status && { status: filters.status as case_status }),
    },
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      title: true,
      status: true,
      category: true,
      is_public: true,
      created_at: true,
      urgency: true,
      description: true,
    },
    skip,
    take,
  });
}
