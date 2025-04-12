// src/modules/auth/data/repository/auth.repository.ts

import { PrismaClient, user_status } from "@prisma/client";
import bcrypt from "bcrypt";
import { RegisterDTO } from "../../domain/dtos/register.dto";
import { User } from "../../domain/entities/user.entity";

const prisma = new PrismaClient();

export class AuthRepository {
  async createUser(data: RegisterDTO): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
  
    const userData = await prisma.users.create({
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: hashedPassword,
        status: user_status.pending,
        creation_timestamp: new Date(),
      },
    });
  
    await prisma.userDetails.create({
      data: {
        user_id: userData.id,
        gender: null,
      },
    });
  
    return new User(
      userData.id,
      userData.first_name,
      userData.last_name,
      userData.email,
      userData.password,
      userData.status,
      userData.creation_timestamp,
      userData.user_type,
      userData.profile_image,
      userData.phone,
      userData.birth_date
    );
  }

  async getEmail(email: string): Promise<User | null> {
    const userData = await prisma.users.findUnique({
      where: { email },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        password: true,
        status: true,
        user_type: true,
        profile_image: true,
        phone: true,
        birth_date: true,
        creation_timestamp: true,
      },
    });

    return userData
      ? new User(
          userData.id,
          userData.first_name,
          userData.last_name,
          userData.email,
          userData.password,
          userData.status,
          userData.creation_timestamp,
          userData.user_type,
          userData.profile_image,
          userData.phone,
          userData.birth_date
        )
      : null;
  }

  async getUserById(userId: number): Promise<User | null> {
    const userData = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        password: true,
        status: true,
        user_type: true,
        profile_image: true,
        phone: true,
        birth_date: true,
        creation_timestamp: true,
      },
    });

    return userData
      ? new User(
          userData.id,
          userData.first_name,
          userData.last_name,
          userData.email,
          userData.password,
          userData.status,
          userData.creation_timestamp,
          userData.user_type,
          userData.profile_image,
          userData.phone,
          userData.birth_date
        )
      : null;
  }

  async updateUserStatus(email: string, status: user_status): Promise<void> {
    await prisma.users.update({
      where: { email },
      data: { status },
    });
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async updateUserPassword(email: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.users.update({
      where: { email },
      data: { password: hashedPassword },
    });
  }
}
