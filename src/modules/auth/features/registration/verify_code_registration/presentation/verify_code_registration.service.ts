//src/modules/auth/features/registration/verify_code_registration/presentation/verify_code_registration.service.ts
import {
  VerifyCodeRegistrationDTO,
  VerifyCodeRegistrationResponseDTO,
} from "../domain/verify_code_registration.dto";
import { VerifyCodeRegistrationUseCase } from "../domain/verify_code_registration.use_case";
import {
  VerifyCodeRegistrationRepository,
  VerifyCodeRegistrationRepositoryImpl,
} from "../data/verify_code_registration.repository";

export class VerifyCodeRegistrationService {
  private readonly repository: VerifyCodeRegistrationRepository;
  private readonly useCase: VerifyCodeRegistrationUseCase;

  constructor() {
    this.repository = new VerifyCodeRegistrationRepositoryImpl();
    this.useCase = new VerifyCodeRegistrationUseCase(this.repository);
  }

  async verifyCodeRegistration(
    data: VerifyCodeRegistrationDTO
  ): Promise<VerifyCodeRegistrationResponseDTO> {
    return this.useCase.execute(data);
  }
}
