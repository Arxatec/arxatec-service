// src/modules/cases/features/messages/data/message.repository.ts
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class MessageRepository {
  async findCaseById(caseId: number) {
    return prisma.cases.findUnique({
      where: { id: caseId },
      include: {
        service: {
          select: {
            client_id: true,
            lawyer_id: true,
            id: true,
          },
        },
      },
    });
  }

  async createMessage(data: Prisma.MessagesCreateInput) {
    return prisma.messages.create({ data });
  }

  async getMessagesByCaseId(caseId: number) {
    return prisma.messages.findMany({
      where: { service_id: caseId },  
      orderBy: { created_at: "asc" },
    });
  }
}