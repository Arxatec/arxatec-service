import { LoginDTO, LoginResponseDTO } from "../domain/login.dto";
import { LoginUseCase } from "../domain/login.use-case";
import { LoginRepository, LoginRepositoryImpl } from "../data/login.repository";

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
