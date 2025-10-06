// src/modules/user/features/edit_profile/data/edit_profile.repository.ts
import { Prisma } from "@prisma/client";
import prisma from "../../../../../config/prisma_client";

type UserRootUpdate = Prisma.usersUpdateInput;
type UserDetailsUpdate = { gender?: string; birth_date?: Date };

export async function updateProfile(
  userId: string,
  root: UserRootUpdate,
  details?: UserDetailsUpdate
) {
  return prisma.users.update({
    where: { id: userId },
    data: {
      ...root,
      ...(details &&
        (details.gender !== undefined || details.birth_date !== undefined) && {
          user_details: {
            upsert: {
              update: {
                ...(details.gender !== undefined && { gender: details.gender }),
                ...(details.birth_date !== undefined && {
                  birth_date: details.birth_date,
                }),
              },
              create: {
                gender: details.gender ?? "unspecified",
                birth_date: details.birth_date ?? null,
              },
            },
          },
        }),
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      user_type: true,
      user_details: { select: { gender: true, birth_date: true } },
      admin_details: { select: { notes: true } },
    },
  });
}

export async function getUserStatus(userId: string) {
  return prisma.users.findUniqueOrThrow({
    where: { id: userId },
    select: { status: true },
  });
}

