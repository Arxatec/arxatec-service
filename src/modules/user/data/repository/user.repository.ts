import { PrismaClient } from "@prisma/client";
import { User } from "../../domain/entities/user.entity";

const prisma = new PrismaClient();

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async create(
    user: Omit<User, "id" | "createdAt" | "updatedAt">
  ): Promise<User> {
    return prisma.user.create({ data: user });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  async deactivate(id: string): Promise<User> {
    return prisma.user.update({ where: { id }, data: { isActive: false } });
  }
}
