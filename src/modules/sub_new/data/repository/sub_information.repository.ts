import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const subscribeUser = async (name: string, email: string) => {
  return await prisma.arxatecSubscribers.create({
    data: { name, email },
  });
};

export const findSubscriberByEmail = async (email: string) => {
  return await prisma.arxatecSubscribers.findUnique({
    where: { email },
  });
};
