import prisma from "../../config/prisma_client";
import { AuthenticatedRequest } from "../../middlewares/authenticate_token";
import { AppError } from "../../utils";
import { HttpStatusCodes } from "../../constants/http_status_codes";

// TODO: Add the user type to the user
export interface CurrentUser {
  id: string;
  role: "admin" | "client" | "employee";
  admin_role?: "superadmin" | "manager";
}

export const getAuthenticatedUser = async (
  req: AuthenticatedRequest
): Promise<CurrentUser> => {
  const id = req.user?.id;

  if (!id) {
    throw new AppError(
      "Token de autenticación no válido o no proporcionado",
      HttpStatusCodes.UNAUTHORIZED.code
    );
  }

  const user = await prisma.users.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      user_type: true,
      admin_details: { select: { role: true } },
    },
  });

  if (
    !user.user_type ||
    (user.user_type !== "admin" &&
      user.user_type !== "client" &&
      user.user_type !== "employee")
  ) {
    throw new AppError(
      "Tipo de usuario no permitido",
      HttpStatusCodes.FORBIDDEN.code
    );
  }

  const result: CurrentUser = {
    id: user.id,
    role: user.user_type,
    admin_role: user.admin_details?.role ?? undefined,
  };

  return result;
};
