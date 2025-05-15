import { User } from "../../../../domain/user.entity";
import prisma from "../../../../../../config/prisma_client";
import { user_status } from "@prisma/client";

export interface LoginGoogleRepository {
  getEmail(email: string): Promise<User | null>;
  createUserFromGoogle(userData: {
    email: string;
    firstName: string;
    lastName: string;
    profileImage: string;
  }): Promise<User>;
}

export class LoginGoogleRepositoryImpl implements LoginGoogleRepository {
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
        creation_timestamp: true,
        user_type: true,
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
          userData.user_type
        )
      : null;
  }

  async createUserFromGoogle(userData: {
    email: string;
    firstName: string;
    lastName: string;
    profileImage: string;
  }): Promise<User> {
    const newUser = await prisma.users.create({
      data: {
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        password: Math.random().toString(36).slice(-16),
        status: user_status.active,
        profile_image: userData.profileImage,
      },
    });

    await prisma.userDetails.create({
      data: {
        user_id: newUser.id,
        gender: null,
        birth_date: null,
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
      newUser.user_type
    );
  }
}
