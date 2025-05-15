import { generateToken } from "../../../../../../infrastructure/jwt";
import { LoginDTO, LoginResponseDTO } from "./login_with_email.dto";
import { LoginRepository } from "../data/login_with_email.repository";
import { AppError } from "../../../../../../utils";
import { HttpStatusCodes } from "../../../../../../constants";
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
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        profileImage: user.profile_image,
      },
      token,
    };
  }
}
