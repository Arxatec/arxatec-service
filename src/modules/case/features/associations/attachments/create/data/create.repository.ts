// src/modules/cases/features/associations/attachments/create/data/create.repository.ts
import prisma from "../../../../../../../config/prisma_client";

export type FindCaseResult = {
  service: {
    lawyer_id: string | number | null;
    client_id: string | number | null;
  };
} | null;

export function findCaseById(caseId: string): Promise<FindCaseResult> {
  return prisma.cases.findUnique({
    where: { id: caseId },
    include: { service: { select: { lawyer_id: true, client_id: true } } },
  });
}

type AddAttachmentArgs = {
  caseId: string;
  category_id: string;
  label: string;
  description?: string;
  file_key: string;
  uploaded_by: "client" | "lawyer";
};

export async function addAttachment(args: AddAttachmentArgs) {
  const caseRecord = await prisma.cases.findUnique({
    where: { id: args.caseId },
    select: { service_id: true },
  });
  if (!caseRecord) return null;

  return prisma.attachments.create({
    data: {
      service: { connect: { id: caseRecord.service_id } },
      category: { connect: { id: args.category_id } },
      label: args.label,
      description: args.description,
      file_key: args.file_key,
      uploaded_by: args.uploaded_by,
    },
  });
}
