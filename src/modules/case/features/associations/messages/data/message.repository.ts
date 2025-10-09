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
          client: {
            select: {
              user: {
                select: {
                  first_name: true,
                  last_name: true,
                },
              },
            },
          },
          lawyer: {
            select: {
              user: {
                select: {
                  first_name: true,
                  last_name: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function createMessageRepo(data: {
  caseId: string;
  content: string;
  sentBy: "client" | "lawyer";
}): Promise<messages> {
  return prisma.messages.create({
    data: {
      case: { connect: { id: data.caseId } },
      content: data.content,
      sent_by: data.sentBy,
      is_read: false,
    },
  });
}

export async function getMessagesByServiceIdRepo(caseId: string) {
  return prisma.messages.findMany({
    where: {
      case_id: caseId,
    },
    orderBy: { created_at: "asc" },
    include: {
      case: {
        select: {
          service: {
            include: {
              client: {
                select: {
                  user: {
                    select: {
                      first_name: true,
                      last_name: true,
                    },
                  },
                },
              },
              lawyer: {
                select: {
                  user: {
                    select: {
                      first_name: true,
                      last_name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}
