// src/modules/auth/features/login/login_with_facebook/data/login_with_facebook.repository.ts
import { User } from "../../../../domain/user.entity";
import prisma from "../../../../../../config/prisma_client";
import bcrypt from "bcrypt";
import crypto from "crypto";

export interface LoginFacebookRepository {
  getByEmail(email: string): Promise<User | null>;
  createFromFacebook(userData: {
    email: string;
    firstName: string;
    lastName: string;
    profileImage: string;
  }): Promise<User>;
}

export class LoginFacebookRepositoryImpl implements LoginFacebookRepository {
  async getByEmail(email: string): Promise<User | null> {
    const u = await prisma.users.findUnique({
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

    return u
      ? new User(
          u.id,
          u.first_name,
          u.last_name,
          u.email,
          u.password,
          u.status,
          u.creation_timestamp ?? undefined,
          u.user_type,
          u.profile_image ?? undefined
        )
      : null;
  }

  async createFromFacebook(userData: {
    email: string;
    firstName: string;
    lastName: string;
    profileImage: string;
  }): Promise<User> {
    const randomPassword = crypto.randomBytes(24).toString("hex");
    const hashed = await bcrypt.hash(randomPassword, 10);

    const nu = await prisma.users.create({
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

    return new User(
      nu.id,
      nu.first_name,
      nu.last_name,
      nu.email,
      nu.password,
      nu.status,
      nu.creation_timestamp ?? undefined,
      nu.user_type,
      nu.profile_image ?? undefined
    );
  }
}
