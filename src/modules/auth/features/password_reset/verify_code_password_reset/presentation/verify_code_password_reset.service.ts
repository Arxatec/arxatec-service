import {
  VerifyCodePasswordResetRepository,
  VerifyCodePasswordResetRepositoryImpl,
} from "../data/verify_code_password_reset.repository";
import { VerifyCodePasswordResetUseCase } from "../domain/verify_code_password_reset.use_case";
import {
  VerifyCodePasswordResetDTO,
  VerifyCodePasswordResetResponseDTO,
} from "../domain/verify_code_password_reset.dto";
export class VerifyCodePasswordResetService {
  private readonly repository: VerifyCodePasswordResetRepository;
  private readonly useCase: VerifyCodePasswordResetUseCase;

  constructor() {
    this.repository = new VerifyCodePasswordResetRepositoryImpl();
    this.useCase = new VerifyCodePasswordResetUseCase(this.repository);
  }

  async verifyCodePasswordReset(
    data: VerifyCodePasswordResetDTO
  ): Promise<VerifyCodePasswordResetResponseDTO> {
    return this.useCase.execute(data);
  }
}
