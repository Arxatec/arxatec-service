// src/modules/case/features/messages/data/message.repository.ts
import prisma from "../../../../../../config/prisma_client";
import { messages } from "@prisma/client";

export async function findCaseByIdRepo(caseId: string) {
  return prisma.cases.findUnique({
    where: { id: caseId },
    include: {
      service: {
        select: {
          id: true,
          client_id: true,
          lawyer_id: true,
        },
      },
    },
  });
}

export async function createMessageRepo(data: {
  serviceId: string;
  content: string;
  sentBy: "client" | "lawyer";
}): Promise<messages> {
  return prisma.messages.create({
    data: {
      service: { connect: { id: data.serviceId } },
      content: data.content,
      sent_by: data.sentBy,
      is_read: false,
    },
  });
}

export async function getMessagesByServiceIdRepo(
  serviceId: string
): Promise<messages[]> {
  return prisma.messages.findMany({
    where: { service_id: serviceId },
    orderBy: { created_at: "asc" },
  });
}
