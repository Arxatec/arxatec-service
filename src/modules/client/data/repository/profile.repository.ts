import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const updateClientProfile = async (id: number, data: any) => {
  return await prisma.user.update({
    where: { id },
    data: {
      ...data,
      birth_date: data.birth_date ? new Date(data.birth_date) : undefined,
    },
  });
};
