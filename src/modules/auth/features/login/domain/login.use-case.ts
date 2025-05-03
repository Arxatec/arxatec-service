import { generateToken } from "../../../../../config/jwt";
import { LoginDTO, LoginResponseDTO } from "./login.dto";
import { LoginRepository } from "../../../../auth/features/login/data/login.repository";
import { AppError } from "../../../../../utils";
import { HttpStatusCodes } from "../../../../../constants";
import bcrypt from "bcrypt";

export class LoginUseCase {
  constructor(private readonly loginRepository: LoginRepository) {}

  async execute(data: LoginDTO): Promise<LoginResponseDTO> {
    const user = await this.loginRepository.getEmail(data.email);
    if (!user) {
      throw new AppError("User not found", HttpStatusCodes.NOT_FOUND.code);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new AppError(
        "Invalid credentials",
        HttpStatusCodes.UNAUTHORIZED.code
      );
    }

    if (!user.isVerified()) {
      throw new AppError(
        "User is not verified",
        HttpStatusCodes.UNAUTHORIZED.code
      );
    }

    const token = generateToken({
      id: user.id,
      user_type: user.user_type,
    });

    return {
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
      token,
    };
  }
}
