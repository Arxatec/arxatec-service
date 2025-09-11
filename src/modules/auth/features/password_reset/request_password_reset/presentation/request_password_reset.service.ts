// src/modules/auth/features/password_reset/request_password_reset/presentation/request_password_reset.service.ts
import {
  RequestPasswordResetDTO,
  RequestPasswordResetResponseDTO,
} from "../domain/request_password_reset.dto";
import {
  RequestPasswordResetRepository,
  RequestPasswordResetRepositoryImpl,
} from "../data/request_password_reset.repository";
import { RequestPasswordResetUseCase } from "../domain/request_password_reset.use_case";

export class RequestPasswordResetService {
  private readonly repository: RequestPasswordResetRepository;
  private readonly useCase: RequestPasswordResetUseCase;

  constructor() {
    this.repository = new RequestPasswordResetRepositoryImpl();
    this.useCase = new RequestPasswordResetUseCase(this.repository);
  }

  async requestPasswordReset(
    data: RequestPasswordResetDTO
  ): Promise<RequestPasswordResetResponseDTO> {
    return this.useCase.execute(data);
  }
}
