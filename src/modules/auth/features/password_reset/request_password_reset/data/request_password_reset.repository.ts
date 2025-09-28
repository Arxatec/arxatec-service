import { User } from "../../../../domain/user.entity";
import prisma from "../../../../../../config/prisma_client";
import { redisClient } from "../../../../../../config/redis";
import { TEMP_PASSWORD_RESET_CODE_KEY } from "../../../../utils";

export async function getByEmailPasswordReset(
  email: string
): Promise<User | null> {
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

export async function createTemporaryCode(
  email: string,
  code: string
): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  const payload = JSON.stringify({ email: normalizedEmail, code });

  await redisClient.set(
    TEMP_PASSWORD_RESET_CODE_KEY(normalizedEmail),
    payload,
    { EX: 15 * 60, NX: true }
  );
}
