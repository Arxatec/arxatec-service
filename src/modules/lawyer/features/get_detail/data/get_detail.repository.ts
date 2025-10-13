import prisma from "../../../../../config/prisma_client";

export function findLawyerById(id: string) {
  return prisma.users.findUnique({
    where: { id, user_type: "lawyer" },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
      profile_image: true,
      creation_timestamp: true,
      lawyer_details: true,
    },
  });
}
