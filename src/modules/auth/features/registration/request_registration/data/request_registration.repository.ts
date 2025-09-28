import prisma from "../../../../../../config/prisma_client";
import { User } from "../../../../domain/user.entity";
import { RequestRegistrationRequest } from "../domain/request_registration.payload";
import { redisClient } from "../../../../../../config/redis";
import { TEMP_CODE_KEY, TEMP_USER_KEY } from "../../../../utils";

export async function getByEmailRegistration(
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

export async function createTemporaryUser(
  data: RequestRegistrationRequest,
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

  await redisClient.set(TEMP_CODE_KEY(normalizedEmail), codePayload, {
    EX: 15 * 60,
    NX: true,
  });

  await redisClient.set(TEMP_USER_KEY(normalizedEmail), userPayload, {
    EX: 60 * 60 * 24,
  });
}
