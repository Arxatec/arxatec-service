// src/modules/case/features/associations/external_clients/create/data/create.repository.ts
import prisma from "../../../../../../../config/prisma_client";

type CreateArgs = {
  full_name: string;
  phone: string;
  dni: string;
  email?: string;
  profile_image?: string;
  userDetailId: string;
};

export function createExternalClientRepo(args: CreateArgs) {
  const { full_name, phone, dni, email, profile_image, userDetailId } = args;
  return prisma.external_clients.create({
    data: {
      full_name,
      phone,
      dni,
      email: email ?? "",
      profile_image,
      user_detail: { connect: { user_id: userDetailId } },
    },
  });
}
