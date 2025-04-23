import {
  RequestPasswordResetDTO,
  RequestPasswordResetResponseDTO,
} from "../domain/request_password_reset.dto";
import {
  RequestPasswordResetRepository,
  RequestPasswordResetRepositoryImpl,
} from "../data/request_password_reset.repository";
import { RequestPasswordResetUseCase } from "../domain/request_password_reset.use-case";

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
