// src/modules/auth/features/password_reset/verify_code_password_reset/domain/verify_code_password_reset.use_case.ts
import { HttpStatusCodes } from "../../../../../../constants";
import { AppError } from "../../../../../../utils";
import { VerifyCodePasswordResetRepository } from "../data/verify_code_password_reset.repository";
import {
  VerifyCodePasswordResetDTO,
  VerifyCodePasswordResetResponseDTO,
} from "./verify_code_password_reset.dto";

const MAX_ATTEMPTS = 5;

export class VerifyCodePasswordResetUseCase {
  constructor(private readonly repository: VerifyCodePasswordResetRepository) {}

  async execute(
    data: VerifyCodePasswordResetDTO
  ): Promise<VerifyCodePasswordResetResponseDTO> {
    const email = data.email.trim().toLowerCase();

    // Sincroniza TTL de intentos con el del código (si aplica)
    const codeTtl = await this.repository.getCodeTTLSeconds(email);
    if (codeTtl && codeTtl > 0) {
      await this.repository.syncAttemptsTTL(email, codeTtl);
    }

    // Incrementa intentos y valida límite
    const attempts = await this.repository.incrementAttempts(email);
    if (attempts > MAX_ATTEMPTS) {
      // seguridad: limpiar estado para obligar a pedir nuevo código
      await this.repository.removeTemporaryCode(email);
      await this.repository.resetAttempts(email);
      throw new AppError(
        "Se superó el máximo de intentos. Solicita un nuevo código.",
        HttpStatusCodes.BAD_REQUEST.code
      );
    }

    const stored = await this.repository.getTemporaryCode(email);
    if (!stored) {
      // inexistente o expirado
      throw new AppError(
        "Código no encontrado o expirado, solicita uno nuevo.",
        HttpStatusCodes.BAD_REQUEST.code
      );
    }

    let parsed: { email: string; code: string } | null = null;
    try {
      parsed = JSON.parse(stored);
    } catch {
      // Inconsistencia en Redis → limpieza defensiva
      await this.repository.removeTemporaryCode(email);
      await this.repository.resetAttempts(email);
      throw new AppError(
        "Código inválido, solicita uno nuevo.",
        HttpStatusCodes.BAD_REQUEST.code
      );
    }

    if (!parsed?.code || parsed.code !== data.code) {
      // código incorrecto, conservamos el conteo (no limpiamos)
      throw new AppError(
        "Código inválido, verifica que sea correcto.",
        HttpStatusCodes.BAD_REQUEST.code
      );
    }

    // Éxito → limpieza total
    await this.repository.removeTemporaryCode(email);
    await this.repository.resetAttempts(email);

    return { message: "Code verified successfully" };
  }
}
