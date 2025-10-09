// src/modules/cases/features/manage/case_detail/data/case_detail.repository.ts
import prisma from "../../../../../../config/prisma_client";

export function getCaseById(id: string) {
  return prisma.cases.findUnique({
    where: { id },
    include: {
      service: {
        select: {
          id: true,
          lawyer_id: true,
          client_id: true,
          external_client_id: true,
        },
      },
      histories: {
        select: {
          id: true,
          field: true,
          old_value: true,
          new_value: true,
          created_at: true,
        },
      },
    },
  });
}
