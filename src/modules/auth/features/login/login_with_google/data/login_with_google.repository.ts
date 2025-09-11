// src/modules/auth/features/login/login_with_google/data/login_with_google.repository.ts
import { User } from "../../../../domain/user.entity";
import prisma from "../../../../../../config/prisma_client";
import bcrypt from "bcrypt";
import crypto from "crypto";

export interface LoginGoogleRepository {
  getByEmail(email: string): Promise<User | null>;
  createFromGoogle(userData: {
    email: string;
    firstName: string;
    lastName: string;
    profileImage: string;
  }): Promise<User>;
}

export class LoginGoogleRepositoryImpl implements LoginGoogleRepository {
  async getByEmail(email: string): Promise<User | null> {
    const userData = await prisma.users.findUnique({
      where: { email },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        password: true,
        status: true,
        creation_timestamp: true,
        user_type: true,
        profile_image: true,
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
          userData.creation_timestamp ?? undefined,
          userData.user_type,
          userData.profile_image ?? undefined
        )
      : null;
  }

  async createFromGoogle(userData: {
    email: string;
    firstName: string;
    lastName: string;
    profileImage: string;
  }): Promise<User> {
    const randomPassword = crypto.randomBytes(24).toString("hex");
    const hashed = await bcrypt.hash(randomPassword, 10);

    const newUser = await prisma.users.create({
      data: {
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        password: hashed,
        status: "active",
        profile_image: userData.profileImage,
        user_type: "client",
      },
      select: {
        id: true, // UUID string
        first_name: true,
        last_name: true,
        email: true,
        password: true,
        status: true,
        creation_timestamp: true,
        user_type: true,
        profile_image: true,
      },
    });

    return new User(
      newUser.id,
      newUser.first_name,
      newUser.last_name,
      newUser.email,
      newUser.password,
      newUser.status,
      newUser.creation_timestamp ?? undefined,
      newUser.user_type,
      newUser.profile_image ?? undefined
    );
  }
}
