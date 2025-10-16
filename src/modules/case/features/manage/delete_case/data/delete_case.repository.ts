// src/modules/cases/features/manage/delete_case/data/delete_case.repository.ts
import prisma from "../../../../../../config/prisma_client";

export async function findCaseForDeletion(case_id: string) {
  return prisma.cases.findUnique({
    where: { id: case_id },
    select: {
      id: true,
      status: true,
      service_id: true,
      service: {
        select: {
          id: true,
          client: { select: { user_id: true } },
          lawyer: { select: { user_id: true } },
        },
      },
    },
  });
}

export async function listAttachmentKeysByCase(
  case_id: string
): Promise<string[]> {
  const caseRow = await prisma.cases.findUnique({
    where: { id: case_id },
    select: { service_id: true },
  });
  if (!caseRow?.service_id) return [];

  const rows = await prisma.attachments.findMany({
    where: { service_id: caseRow.service_id },
    select: { file_key: true },
  });

  return rows.map((r) => r.file_key).filter(Boolean);
}

export async function deleteCaseRecord(case_id: string) {
  return prisma.cases.delete({ where: { id: case_id }, select: { id: true } });
}
