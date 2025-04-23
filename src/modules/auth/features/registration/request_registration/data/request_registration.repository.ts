import { User } from "../../../../domain/user.entity";
import prisma from "../../../../../../config/prisma_client";
import { RequestRegistrationDTO } from "../domain/request_registration.dto";
import { redisClient } from "../../../../../../config/redis";

export interface RequestRegistrationRepository {
  getEmail(email: string): Promise<User | null>;
  createTemporaryUser(
    data: RequestRegistrationDTO,
    code: string
  ): Promise<void>;
}

export class RequestRegistrationRepositoryImpl
  implements RequestRegistrationRepository
{
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

  async createTemporaryUser(data: RequestRegistrationDTO, code: string) {
    const temporaryRegistrationCode = {
      email: data.email,
      code,
    };

    await redisClient.set(
      `TEMPORARY_REGISTRATION_CODE:${data.email}`,
      JSON.stringify(temporaryRegistrationCode),
      {
        EX: 15 * 60,
      }
    );

    await redisClient.set(
      `TEMPORARY_USER_REGISTRATION:${data.email}`,
      JSON.stringify(data),
      {
        EX: 60 * 60 * 24,
      }
    );
  }
}
