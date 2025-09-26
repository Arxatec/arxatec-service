// src/utils/authenticated_user/index.ts
import prisma from "../../config/prisma_client";
import { AuthenticatedRequest } from "../../middlewares/authenticate_token";
import { AppError } from "../../utils/errors";
import { HttpStatusCodes } from "../../constants/http_status_codes";

export interface CurrentUser {
  id: string;
  role: "admin" | "client" | "lawyer";
}

export const getAuthenticatedUser = async (
  req: AuthenticatedRequest
): Promise<CurrentUser> => {
  const rawId = req.user?.id;

  if (!rawId) {
    throw new AppError(
      "Token de autenticación no válido o no proporcionado",
      HttpStatusCodes.UNAUTHORIZED.code
    );
  }

  if (typeof rawId !== "string" || rawId.length < 10) {
    throw new AppError(
      "Identificador de usuario inválido",
      HttpStatusCodes.UNAUTHORIZED.code
    );
  }

  const user = await prisma.users.findUniqueOrThrow({
    where: { id: rawId },
    select: {
      id: true,
      user_type: true,
    },
  });

  if (
    !user.user_type ||
    !["admin", "client", "lawyer"].includes(user.user_type)
  ) {
    throw new AppError(
      "Tipo de usuario no permitido",
      HttpStatusCodes.FORBIDDEN.code
    );
  }

  return {
    id: user.id,
    role: user.user_type,
  };
};
