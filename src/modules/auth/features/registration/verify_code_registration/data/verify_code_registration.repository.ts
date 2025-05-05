import { User } from "../../../../domain/user.entity";
import { RequestRegistrationDTO } from "../../request_registration/domain/request_registration.dto";
import { user_status } from "@prisma/client";
import prisma from "../../../../../../config/prisma_client";
import { redisClient } from "../../../../../../config/redis";

export interface VerifyCodeRegistrationRepository {
  createUser(data: RequestRegistrationDTO): Promise<User>;
  getTemporaryCode(email: string): Promise<string | null>;
  getTemporaryUser(email: string): Promise<string | null>;
  removeTemporaryUser(email: string): Promise<void>;
}

export class VerifyCodeRegistrationRepositoryImpl
  implements VerifyCodeRegistrationRepository
{
  async createUser(data: RequestRegistrationDTO): Promise<User> {
    const userData = await prisma.users.create({
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        status: user_status.active,
      },
    });

    await prisma.userDetails.create({
      data: {
        user_id: userData.id,
        gender: null,
        birth_date: null,
      },
    });

    return new User(
      userData.id,
      userData.first_name,
      userData.last_name,
      userData.email,
      userData.password,
      userData.status,
      userData.creation_timestamp ?? undefined,
      userData.user_type
    );
  }

  async getTemporaryCode(email: string): Promise<string | null> {
    const temporaryCodeRaw = await redisClient.get(
      `TEMPORARY_REGISTRATION_CODE:${email}`
    );
    return temporaryCodeRaw;
  }

  async getTemporaryUser(email: string): Promise<string | null> {
    const temporaryUserDataRaw = await redisClient.get(
      `TEMPORARY_USER_REGISTRATION:${email}`
    );
    return temporaryUserDataRaw;
  }

  async removeTemporaryUser(email: string) {
    await redisClient.del(`TEMPORARY_REGISTRATION_CODE:${email}`);
    await redisClient.del(`TEMPORARY_USER_REGISTRATION:${email}`);
  }
}
