import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class WaitlistRepository {
  async findSubscriberByEmail(email: string) {
    return await prisma.arxatecSubscribers.findUnique({
      where: { email },
    });
  }

  async subscribeUser(name: string, email: string) {
    return await prisma.arxatecSubscribers.create({
      data: { name, email },
    });
  }
}
