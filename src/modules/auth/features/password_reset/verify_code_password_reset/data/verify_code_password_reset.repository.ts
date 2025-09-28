import { redisClient } from "../../../../../../config/redis";
import {
  TEMP_PASSWORD_RESET_ATTEMPTS_KEY,
  TEMP_PASSWORD_RESET_CODE_KEY,
} from "../../../../utils";

export async function getTemporaryCode(email: string): Promise<string | null> {
  return await redisClient.get(TEMP_PASSWORD_RESET_CODE_KEY(email));
}

export async function removeTemporaryCode(email: string): Promise<void> {
  await redisClient.del(TEMP_PASSWORD_RESET_CODE_KEY(email));
}

export async function incrementAttempts(email: string): Promise<number> {
  const key = TEMP_PASSWORD_RESET_ATTEMPTS_KEY(email);
  const attempts = await redisClient.incr(key);
  return attempts;
}

export async function getAttempts(email: string): Promise<number> {
  const raw = await redisClient.get(TEMP_PASSWORD_RESET_ATTEMPTS_KEY(email));
  return raw ? Number(raw) : 0;
}

export async function resetAttempts(email: string): Promise<void> {
  await redisClient.del(TEMP_PASSWORD_RESET_ATTEMPTS_KEY(email));
}

export async function getCodeTTLSeconds(email: string): Promise<number | null> {
  const ttl = await redisClient.ttl(TEMP_PASSWORD_RESET_CODE_KEY(email));
  // ttl: -2 key no exists, -1 no expiration, >=0 seconds remaining
  if (ttl >= 0) return ttl;
  return null;
}

export async function syncAttemptsTTL(
  email: string,
  ttlSeconds: number
): Promise<void> {
  if (ttlSeconds > 0) {
    await redisClient.expire(
      TEMP_PASSWORD_RESET_ATTEMPTS_KEY(email),
      ttlSeconds
    );
  }
}
