// src/modules/auth/features/password_reset/confirm_password_reset/presentation/confirm_password_reset.service.ts
import {
  ConfirmPasswordResetRepository,
  ConfirmPasswordResetRepositoryImpl,
} from "../data/confirm_password_reset.repository";
import {
  ConfirmPasswordResetDTO,
  ConfirmPasswordResetResponseDTO,
} from "../domain/confirm_password_reset.dto";
import { ConfirmPasswordResetUseCase } from "../domain/confirm_password_reset.use_case";

// 👇 opcional: si quieres inyectar explícitamente el verifyRepo aquí, puedes hacerlo.

export class ConfirmPasswordResetService {
  private readonly repository: ConfirmPasswordResetRepository;
  private readonly useCase: ConfirmPasswordResetUseCase;

  constructor() {
    this.repository = new ConfirmPasswordResetRepositoryImpl();
    this.useCase = new ConfirmPasswordResetUseCase(this.repository);
  }

  async confirmPasswordReset(
    data: ConfirmPasswordResetDTO
  ): Promise<ConfirmPasswordResetResponseDTO> {
    return this.useCase.execute(data);
  }
}
