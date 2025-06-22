// src/utils/authenticated_user/authenticated_user.ts
import { AuthenticatedRequest } from "../../middlewares/authenticate_token";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAuthenticatedUser = async (req: AuthenticatedRequest) => {
  const id = req.user?.id;
  if (!id) throw new Error("Usuario no autenticado");

  return prisma.users.findUnique({
    where: { id },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      profile_image: true,
      user_type: true,
      status: true,
      clientDetails: true,
      lawyerDetails: true,
    },
  });
};
