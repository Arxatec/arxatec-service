import { User } from "../../../../domain/user.entity";
import prisma from "../../../../../../config/prisma_client";
import { redisClient } from "../../../../../../config/redis";

export interface RequestPasswordResetRepository {
  getEmail(email: string): Promise<User | null>;
  createTemporaryCode(email: string, code: string): Promise<void>;
}

export class RequestPasswordResetRepositoryImpl
  implements RequestPasswordResetRepository
{
  async getEmail(email: string): Promise<User | null> {
    const userData = await prisma.user.findUnique({
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
          userData.creation_timestamp,
          userData.user_type
        )
      : null;
  }

  async createTemporaryCode(email: string, code: string) {
    const temporaryCode = {
      email,
      code,
    };

    await redisClient.set(
      `TEMPORARY_PASSWORD_RESET_CODE:${email}`,
      JSON.stringify(temporaryCode),
      {
        EX: 15 * 60,
      }
    );
  }
}
