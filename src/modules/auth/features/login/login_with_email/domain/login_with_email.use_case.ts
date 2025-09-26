// src/modules/auth/features/login/login_with_email/domain/login_with_email.use_case.ts
import { generateToken } from "../../../../../../infrastructure/jwt";
import { LoginDTO, LoginResponseDTO } from "./login_with_email.dto";
import { LoginRepository } from "../data/login_with_email.repository";
import { AppError } from "../../../../../../utils";
import { HttpStatusCodes } from "../../../../../../constants";
import bcrypt from "bcrypt";

export class LoginUseCase {
  constructor(private readonly loginRepository: LoginRepository) {}

  async execute(data: LoginDTO): Promise<LoginResponseDTO> {
    const user = await this.loginRepository.getByEmail(data.email);
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

    const userType: "admin" | "client" | "lawyer" | null =
      user.user_type ?? null;

    const token = generateToken({
      id: user.id, 
      user_type: userType ?? "client", 
    });

    return {
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        userType: userType,
        role: null,
      },
      token,
    };
  }
}
