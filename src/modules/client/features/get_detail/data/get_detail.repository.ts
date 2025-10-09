import prisma from "../../../../../config/prisma_client";

export function findClientById(id: string) {
  return prisma.users.findUnique({
    where: { id, user_type: "client" },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
      profile_image: true,
      creation_timestamp: true,
      client_details: true,
    },
  });
}
