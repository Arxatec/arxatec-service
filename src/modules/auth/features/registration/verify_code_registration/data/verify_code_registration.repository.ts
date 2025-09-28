import prisma from "../../../../../../config/prisma_client";
import { User } from "../../../../domain/user.entity";
import { RequestRegistrationRequest } from "../../request_registration/domain/request_registration.payload";
import { redisClient } from "../../../../../../config/redis";
import { TEMP_CODE_KEY, TEMP_USER_KEY } from "../../../../utils";

export async function createUser(
  data: RequestRegistrationRequest
): Promise<User> {
  const normalizedEmail = data.email.trim().toLowerCase();

  const created = await prisma.$transaction(async (tx) => {
    const user = await tx.users.create({
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: normalizedEmail,
        password: data.password,
        status: "active",
        user_type: "client",
      },
    });

    await tx.user_details.create({
      data: { user_id: user.id },
    });

    return user;
  });

  return new User(
    created.id,
    created.first_name,
    created.last_name,
    created.email,
    created.password,
    created.status,
    created.creation_timestamp ?? undefined,
    created.user_type
  );
}

export async function getTemporaryCode(email: string): Promise<string | null> {
  return await redisClient.get(TEMP_CODE_KEY(email));
}

export async function getTemporaryUser(email: string): Promise<string | null> {
  return await redisClient.get(TEMP_USER_KEY(email));
}

export async function removeTemporaryUser(email: string): Promise<void> {
  await redisClient.del(TEMP_CODE_KEY(email));
  await redisClient.del(TEMP_USER_KEY(email));
}
