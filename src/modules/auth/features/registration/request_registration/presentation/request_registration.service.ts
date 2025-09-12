//src/modules/auth/features/registration/request_reqistration/presentation/request_registration.service.ts
import {
  RequestRegistrationDTO,
  RequestRegistrationResponseDTO,
} from "../domain/request_registration.dto";
import { RequestRegistrationUseCase } from "../domain/request_registration.use_case";
import {
  RequestRegistrationRepository,
  RequestRegistrationRepositoryImpl,
} from "../data/request_registration.repository";

export class RequestRegistrationService {
  private readonly repository: RequestRegistrationRepository;
  private readonly useCase: RequestRegistrationUseCase;

  constructor() {
    this.repository = new RequestRegistrationRepositoryImpl();
    this.useCase = new RequestRegistrationUseCase(this.repository);
  }

  async requestRegistration(
    data: RequestRegistrationDTO
  ): Promise<RequestRegistrationResponseDTO> {
    return this.useCase.execute(data);
  }
}
