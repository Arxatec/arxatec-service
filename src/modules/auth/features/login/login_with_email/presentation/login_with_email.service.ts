import { LoginDTO, LoginResponseDTO } from "../domain/login_with_email.dto";
import { LoginUseCase } from "../domain/login_with_email.use_case";
import {
  LoginRepository,
  LoginRepositoryImpl,
} from "../data/login_with_email.repository";

export class LoginService {
  private readonly loginRepository: LoginRepository;
  private readonly loginUseCase: LoginUseCase;

  constructor() {
    this.loginRepository = new LoginRepositoryImpl();
    this.loginUseCase = new LoginUseCase(this.loginRepository);
  }

  async login(data: LoginDTO): Promise<LoginResponseDTO> {
    return this.loginUseCase.execute(data);
  }
}
