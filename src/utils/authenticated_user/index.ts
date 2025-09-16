// src/utils/authenticated_user/index.ts
import prisma from "../../config/prisma_client";
import { AuthenticatedRequest } from "../../middlewares/authenticate_token";
import { AppError } from "../../utils/errors";
import { HttpStatusCodes } from "../../constants/http_status_codes";

type Role = "admin" | "client" | "lawyer";

export interface CurrentUser {
  id: string;
  role: Role;
}

export type ClientOrLawyer = {
  id: string;
  role: Exclude<Role, "admin">;
};

function isClientOrLawyer(u: CurrentUser): u is ClientOrLawyer {
  return u.role !== "admin";
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
    select: { id: true, user_type: true },
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

  return { id: user.id, role: user.user_type as CurrentUser["role"] };
};

export const requireClientOrLawyer = async (
  req: AuthenticatedRequest
): Promise<ClientOrLawyer> => {
  const u = await getAuthenticatedUser(req);

  if (!isClientOrLawyer(u)) {
    throw new AppError(
      "Solo clientes o abogados pueden realizar esta operación",
      HttpStatusCodes.FORBIDDEN.code
    );
  }
  return u;
};
