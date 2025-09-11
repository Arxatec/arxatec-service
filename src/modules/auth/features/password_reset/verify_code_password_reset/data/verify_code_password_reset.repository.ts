// src/modules/auth/features/password_reset/verify_code_password_reset/data/verify_code_password_reset.repository.ts
import { redisClient } from "../../../../../../config/redis";

const CODE_KEY = (email: string) =>
  `TEMPORARY_PASSWORD_RESET_CODE:${email.trim().toLowerCase()}`;

const ATTEMPTS_KEY = (email: string) =>
  `TEMPORARY_PASSWORD_RESET_ATTEMPTS:${email.trim().toLowerCase()}`;

export interface VerifyCodePasswordResetRepository {
  getTemporaryCode(email: string): Promise<string | null>;
  removeTemporaryCode(email: string): Promise<void>;

  // NUEVO: control de intentos
  incrementAttempts(email: string): Promise<number>;
  getAttempts(email: string): Promise<number>;
  resetAttempts(email: string): Promise<void>;
  getCodeTTLSeconds(email: string): Promise<number | null>;
  syncAttemptsTTL(email: string, ttlSeconds: number): Promise<void>;
}

export class VerifyCodePasswordResetRepositoryImpl
  implements VerifyCodePasswordResetRepository
{
  async getTemporaryCode(email: string): Promise<string | null> {
    return await redisClient.get(CODE_KEY(email));
  }

  async removeTemporaryCode(email: string): Promise<void> {
    await redisClient.del(CODE_KEY(email));
  }

  // ---- intentos ----
  async incrementAttempts(email: string): Promise<number> {
    const key = ATTEMPTS_KEY(email);
    const attempts = await redisClient.incr(key);
    return attempts;
  }

  async getAttempts(email: string): Promise<number> {
    const raw = await redisClient.get(ATTEMPTS_KEY(email));
    return raw ? Number(raw) : 0;
  }

  async resetAttempts(email: string): Promise<void> {
    await redisClient.del(ATTEMPTS_KEY(email));
  }

  async getCodeTTLSeconds(email: string): Promise<number | null> {
    const ttl = await redisClient.ttl(CODE_KEY(email));
    // ttl: -2 key no existe, -1 sin expiración, >=0 segundos restantes
    if (ttl >= 0) return ttl;
    return null;
  }

  async syncAttemptsTTL(email: string, ttlSeconds: number): Promise<void> {
    if (ttlSeconds > 0) {
      await redisClient.expire(ATTEMPTS_KEY(email), ttlSeconds);
    }
  }
}
