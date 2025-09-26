// src/modules/auth/features/registration/verify_code_registration/data/verify_code_registration.repository.ts
import { User } from "../../../../domain/user.entity";
import { RequestRegistrationDTO } from "../../request_registration/domain/request_registration.dto";
import prisma from "../../../../../../config/prisma_client";
import { redisClient } from "../../../../../../config/redis";

// Claves Redis
const TEMP_CODE_KEY = (email: string) =>
  `TEMPORARY_REGISTRATION_CODE:${email.trim().toLowerCase()}`;
const TEMP_USER_KEY = (email: string) =>
  `TEMPORARY_USER_REGISTRATION:${email.trim().toLowerCase()}`;

// Tipo correcto para crear el usuario desde el payload temporal (sin confirm_password)
export type NewUserData = Omit<RequestRegistrationDTO, "confirm_password">;

export interface VerifyCodeRegistrationRepository {
  createUser(data: NewUserData): Promise<User>;
  getTemporaryCode(email: string): Promise<string | null>;
  getTemporaryUser(email: string): Promise<string | null>;
  removeTemporaryUser(email: string): Promise<void>;
}

export class VerifyCodeRegistrationRepositoryImpl
  implements VerifyCodeRegistrationRepository
{
  async createUser(data: NewUserData): Promise<User> {
    const normalizedEmail = data.email.trim().toLowerCase();

    // Crear usuario + user_details en UNA sola transacción
    const created = await prisma.$transaction(async (tx) => {
      const user = await tx.users.create({
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          email: normalizedEmail,
          password: data.password, // ya viene hasheada desde el request slice
          status: "active",
          user_type: "client",
        },
      });

      // UUID: user.id es string y user_details.user_id es String @db.Uuid
      await tx.user_details.create({
        data: { user_id: user.id },
      });

      return user;
    });

    return new User(
      created.id, // string (UUID)
      created.first_name,
      created.last_name,
      created.email,
      created.password,
      created.status,
      created.creation_timestamp ?? undefined,
      created.user_type
    );
  }

  async getTemporaryCode(email: string): Promise<string | null> {
    return await redisClient.get(TEMP_CODE_KEY(email));
  }

  async getTemporaryUser(email: string): Promise<string | null> {
    return await redisClient.get(TEMP_USER_KEY(email));
  }

  async removeTemporaryUser(email: string): Promise<void> {
    await redisClient.del(TEMP_CODE_KEY(email));
    await redisClient.del(TEMP_USER_KEY(email));
  }
}
