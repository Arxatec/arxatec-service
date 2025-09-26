// src/modules/auth/features/registration/request_reqistration/data/request_registration.repository.ts
import { User } from "../../../../domain/user.entity";
import prisma from "../../../../../../config/prisma_client";
import { RequestRegistrationDTO } from "../domain/request_registration.dto";
import { redisClient } from "../../../../../../config/redis";

export interface RequestRegistrationRepository {
  getByEmail(email: string): Promise<User | null>;
  createTemporaryUser(
    data: RequestRegistrationDTO,
    code: string
  ): Promise<void>;
}

export class RequestRegistrationRepositoryImpl
  implements RequestRegistrationRepository
{
  async getByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.trim().toLowerCase();

    const userData = await prisma.users.findUnique({
      where: { email: normalizedEmail },
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

  async createTemporaryUser(
    data: RequestRegistrationDTO,
    code: string
  ): Promise<void> {
    const normalizedEmail = data.email.trim().toLowerCase();

    const codePayload = JSON.stringify({ email: normalizedEmail, code });
    const userPayload = JSON.stringify({
      first_name: data.first_name,
      last_name: data.last_name,
      email: normalizedEmail,
      password: data.password, 
    });

    // Código: 15 min, no sobrescribir si ya existe uno vigente
    await redisClient.set(
      `TEMPORARY_REGISTRATION_CODE:${normalizedEmail}`,
      codePayload,
      { EX: 15 * 60, NX: true }
    );

    // Datos del usuario: 24 h
    await redisClient.set(
      `TEMPORARY_USER_REGISTRATION:${normalizedEmail}`,
      userPayload,
      { EX: 60 * 60 * 24 }
    );
  }
}
