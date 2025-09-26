// src/modules/waitlist/data/waitlist.repository.ts
import prisma from "../../../config/prisma_client";

export class WaitlistRepository {
  findSubscriberByEmail(email: string) {
    return prisma.arxatec_subscribers.findUnique({ where: { email } });
  }

  subscribeUser(name: string, email: string) {
    return prisma.arxatec_subscribers.create({ data: { name, email } });
  }
}
