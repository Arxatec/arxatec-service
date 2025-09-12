// src/modules/auth/features/login/login_with_email/data/login_with_email.repository.ts
import { User } from "../../../../domain/user.entity";
import prisma from "../../../../../../config/prisma_client";

export interface LoginRepository {
  getByEmail(email: string): Promise<User | null>;
}

export class LoginRepositoryImpl implements LoginRepository {
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
}
