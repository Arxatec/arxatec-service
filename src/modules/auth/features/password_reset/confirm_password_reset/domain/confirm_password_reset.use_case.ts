// src/modules/auth/features/password_reset/confirm_password_reset/domain/confirm_password_reset.use_case.ts
import { HttpStatusCodes } from "../../../../../../constants";
import { AppError } from "../../../../../../utils";
import { ConfirmPasswordResetRepository } from "../data/confirm_password_reset.repository";
import {
  ConfirmPasswordResetDTO,
  ConfirmPasswordResetResponseDTO,
} from "./confirm_password_reset.dto";
import bcrypt from "bcrypt";

// 👇 importa la interfaz de tu repo de verificación (Redis)
import {
  VerifyCodePasswordResetRepository,
  VerifyCodePasswordResetRepositoryImpl,
} from "../../verify_code_password_reset/data/verify_code_password_reset.repository";

export class ConfirmPasswordResetUseCase {
  constructor(
    private readonly repository: ConfirmPasswordResetRepository,
    private readonly verifyRepo: VerifyCodePasswordResetRepository = new VerifyCodePasswordResetRepositoryImpl()
  ) {}

  async execute(
    data: ConfirmPasswordResetDTO
  ): Promise<ConfirmPasswordResetResponseDTO> {
    const normalizedEmail = data.email.trim().toLowerCase();
    const hashed = await bcrypt.hash(data.password, 10);

    const updated = await this.repository.updatePassword(
      normalizedEmail,
      hashed
    );
    if (!updated) {
      throw new AppError(
        "Usuario no encontrado",
        HttpStatusCodes.NOT_FOUND.code
      );
    }

    // 🔐 buena práctica: invalidar el código temporal tras el cambio
    await this.verifyRepo.removeTemporaryCode(normalizedEmail);

    return { message: "Password reset successfully" };
  }
}
