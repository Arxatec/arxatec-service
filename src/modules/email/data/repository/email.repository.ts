import { PrismaClient, user_type } from "@prisma/client";

const prisma = new PrismaClient();

export class EmailRepository {
  async getEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async updateUserStatus(email: string, status: "active" | "pending") {
    return prisma.user.update({ where: { email }, data: { status } });
  }

  async getUsersEmails(userType?: user_type): Promise<string[]> {
  const users = await prisma.user.findMany({
    where: userType ? { user_type: userType } : {},
    select: { email: true },
  });

  return users.map((user) => user.email);
}

}