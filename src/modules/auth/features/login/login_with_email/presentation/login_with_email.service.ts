import { generateToken } from "../../../../../../infrastructure/jwt";
import { AppError } from "../../../../../../utils";
import { HttpStatusCodes } from "../../../../../../constants";
import { getByEmail } from "../data/login_with_email.repository";
import {
  LoginResponse,
  LoginRequest,
} from "../domain/login_with_email.payload";
import bcrypt from "bcrypt";

export async function loginWithEmail(
  data: LoginRequest
): Promise<LoginResponse> {
  const user = await getByEmail(data.email);
  if (!user) {
    throw new AppError(
      "El usuario no existe, revisa que el correo electrónico sea correcto.",
      HttpStatusCodes.NOT_FOUND.code
    );
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    throw new AppError(
      "Credenciales inválidas, revisa que el correo electrónico y la contraseña sean correctos.",
      HttpStatusCodes.UNAUTHORIZED.code
    );
  }

  if (!user.isActive()) {
    throw new AppError(
      "El usuario no está verificado, por favor verifica tu correo electrónico.",
      HttpStatusCodes.UNAUTHORIZED.code
    );
  }

  const userType: "admin" | "client" | "lawyer" | null = user.user_type ?? null;

  const token = generateToken({
    id: user.id,
    user_type: userType ?? "client",
  });

  return {
    user: {
      id: user.id,
      name: user.first_name + " " + user.last_name,
      email: user.email,
      user_type: userType,
    },
    token,
  };
}
