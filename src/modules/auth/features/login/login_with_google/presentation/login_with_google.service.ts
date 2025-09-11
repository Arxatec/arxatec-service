// src/modules/auth/features/login/login_with_google/presentation/login_with_google.service.ts
import {
  LoginGoogleDTO,
  LoginGoogleResponseDTO,
} from "../domain/login_with_google.dto";
import { LoginGoogleUseCase } from "../domain/login_with_google.use_case";
import {
  LoginGoogleRepository,
  LoginGoogleRepositoryImpl,
} from "../data/login_with_google.repository";

export class LoginGoogleService {
  private readonly loginGoogleRepository: LoginGoogleRepository;
  private readonly loginGoogleUseCase: LoginGoogleUseCase;

  constructor() {
    this.loginGoogleRepository = new LoginGoogleRepositoryImpl();
    this.loginGoogleUseCase = new LoginGoogleUseCase(
      this.loginGoogleRepository
    );
  }

  async loginWithGoogle(data: LoginGoogleDTO): Promise<LoginGoogleResponseDTO> {
    return this.loginGoogleUseCase.execute(data);
  }
}
