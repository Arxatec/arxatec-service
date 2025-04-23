import { PrismaClient, user_type } from "@prisma/client";

const prisma = new PrismaClient();

export class EmailRepository {
  async getEmail(email: string) {
    return prisma.users.findUnique({ where: { email } });
  }

  async updateUserStatus(email: string, status: "active" | "pending") {
    return prisma.users.update({ where: { email }, data: { status } });
  }

  async getUsersEmails(userType?: user_type): Promise<string[]> {
  const users = await prisma.users.findMany({
    where: userType ? { user_type: userType } : {},
    select: { email: true },
  });

  return users.map((users) => users.email);
}

}