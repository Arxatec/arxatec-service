import prisma from "../../../../config/prisma_client";

export class UserRepository {
  async findById(userId: number) {
    return await prisma.users.findUnique({
      where: { id: userId },
    });
  }
}
