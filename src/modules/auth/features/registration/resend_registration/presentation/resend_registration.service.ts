import {
  ResendRegistrationDTO,
  ResendRegistrationResponseDTO,
} from "../domain/resend_registration.dto";
import {
  ResendRegistrationRepository,
  ResendRegistrationRepositoryImpl,
} from "../data/resend_registration.repository";
import { ResendRegistrationUseCase } from "../domain/resend_registration.use_case";

export class ResendRegistrationService {
  private readonly repository: ResendRegistrationRepository;
  private readonly useCase: ResendRegistrationUseCase;

  constructor() {
    this.repository = new ResendRegistrationRepositoryImpl();
    this.useCase = new ResendRegistrationUseCase(this.repository);
  }

  async resendRegistration(
    data: ResendRegistrationDTO
  ): Promise<ResendRegistrationResponseDTO> {
    return this.useCase.execute(data);
  }
}
