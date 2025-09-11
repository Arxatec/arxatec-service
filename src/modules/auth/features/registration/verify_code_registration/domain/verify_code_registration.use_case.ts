// src/modules/auth/features/registration/verify_code_registration/domain/verify_code_registration.use_case.ts
import { AppError } from "../../../../../../utils";
import { HttpStatusCodes } from "../../../../../../constants";
import {
  VerifyCodeRegistrationDTO,
  VerifyCodeRegistrationResponseDTO,
} from "./verify_code_registration.dto";
import { VerifyCodeRegistrationRepository } from "../data/verify_code_registration.repository";

export class VerifyCodeRegistrationUseCase {
  constructor(private readonly repository: VerifyCodeRegistrationRepository) {}

  async execute(
    data: VerifyCodeRegistrationDTO
  ): Promise<VerifyCodeRegistrationResponseDTO> {
    const normalizedEmail = data.email.trim().toLowerCase();

    const storedCode = await this.repository.getTemporaryCode(normalizedEmail);
    const userData = await this.repository.getTemporaryUser(normalizedEmail);

    if (!storedCode || !userData) {
      throw new AppError(
        "Código expirado o no encontrado, solicita uno nuevo.",
        HttpStatusCodes.BAD_REQUEST.code
      );
    }

    let parsedCode: { email: string; code: string } | null = null;
    let parsedUser: {
      first_name: string;
      last_name: string;
      email: string;
      password: string; // ya hasheada
    } | null = null;

    try {
      parsedCode = JSON.parse(storedCode);
      parsedUser = JSON.parse(userData);
    } catch {
      await this.repository.removeTemporaryUser(normalizedEmail);
      throw new AppError(
        "Código inválido, solicita uno nuevo.",
        HttpStatusCodes.BAD_REQUEST.code
      );
    }

    if (!parsedCode?.code || parsedCode.code !== data.code) {
      throw new AppError(
        "Código de verificación inválido, por favor verifica que el código sea correcto.",
        HttpStatusCodes.UNAUTHORIZED.code
      );
    }

    // Guardas defensivas: email debe coincidir y existir payload mínimo
    if (
      !parsedUser?.email ||
      parsedUser.email.toLowerCase() !== normalizedEmail ||
      !parsedUser.first_name ||
      !parsedUser.last_name ||
      !parsedUser.password
    ) {
      await this.repository.removeTemporaryUser(normalizedEmail);
      throw new AppError(
        "Datos temporales inválidos, solicita un nuevo código.",
        HttpStatusCodes.BAD_REQUEST.code
      );
    }

    try {
      await this.repository.createUser(parsedUser);
    } catch (err: any) {
      if (err?.code === "P2002") {
        throw new AppError(
          "El correo electrónico ya está registrado.",
          HttpStatusCodes.CONFLICT.code
        );
      }
      throw err;
    }

    await this.repository.removeTemporaryUser(normalizedEmail);
    return { message: "User verified and registered successfully" };
  }
}
