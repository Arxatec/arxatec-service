import { redisClient } from "../../../../../../config/redis";
import { TEMP_CODE_KEY, TEMP_USER_KEY } from "../../../../utils";

export async function getTemporaryUser(email: string): Promise<string | null> {
  return await redisClient.get(TEMP_USER_KEY(email));
}

export async function getTemporaryCode(email: string): Promise<string | null> {
  return await redisClient.get(TEMP_CODE_KEY(email));
}

export async function createTemporaryCode(
  email: string,
  code: string
): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  const payload = JSON.stringify({ email: normalizedEmail, code });

  await redisClient.set(TEMP_CODE_KEY(normalizedEmail), payload, {
    EX: 15 * 60,
    NX: true,
  });
}

export async function getCodeTTLSeconds(email: string): Promise<number | null> {
  const ttl = await redisClient.ttl(TEMP_CODE_KEY(email));
  // ttl: -2 = no exists, -1 = no expiration, >=0 = seconds remaining
  if (ttl >= 0) return ttl;
  return null;
}
