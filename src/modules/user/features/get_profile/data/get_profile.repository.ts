// src/modules/user/features/get_profile/data/get_profile.repository.ts
import prisma from "../../../../../config/prisma_client";

export class GetProfileRepository {
  getProfile(id: string) {
    return prisma.users.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        user_type: true,
        status: true,
        user_details: { select: { gender: true, birth_date: true } },
        admin_details: { select: { notes: true } },
      },
    });
  }
}
