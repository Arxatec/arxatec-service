// src/modules/auth/features/registration/resend_registration/data/resend_registration.repository.ts
import { redisClient } from "../../../../../../config/redis";

const TEMP_USER_KEY = (email: string) =>
  `TEMPORARY_USER_REGISTRATION:${email.trim().toLowerCase()}`;

const TEMP_CODE_KEY = (email: string) =>
  `TEMPORARY_REGISTRATION_CODE:${email.trim().toLowerCase()}`;

export interface ResendRegistrationRepository {
  getTemporaryUser(email: string): Promise<string | null>;
  getTemporaryCode(email: string): Promise<string | null>;
  createTemporaryCode(email: string, code: string): Promise<void>;
  getCodeTTLSeconds(email: string): Promise<number | null>;
}

export class ResendRegistrationRepositoryImpl
  implements ResendRegistrationRepository
{
  async getTemporaryUser(email: string): Promise<string | null> {
    return await redisClient.get(TEMP_USER_KEY(email));
  }

  async getTemporaryCode(email: string): Promise<string | null> {
    return await redisClient.get(TEMP_CODE_KEY(email));
  }

  async createTemporaryCode(email: string, code: string): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase();
    const payload = JSON.stringify({ email: normalizedEmail, code });

    // 15 min y NO sobrescribas si ya existe
    await redisClient.set(TEMP_CODE_KEY(normalizedEmail), payload, {
      EX: 15 * 60,
      NX: true,
    });
  }

  async getCodeTTLSeconds(email: string): Promise<number | null> {
    const ttl = await redisClient.ttl(TEMP_CODE_KEY(email));
    // ttl: -2 = no existe, -1 = sin expiración, >=0 = segundos restantes
    if (ttl >= 0) return ttl;
    return null;
  }
}
