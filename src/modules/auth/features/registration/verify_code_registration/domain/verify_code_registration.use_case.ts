import { AppError } from "../../../../../../utils";
import { HttpStatusCodes } from "../../../../../../constants";
import {
  VerifyCodeRegistrationDTO,
  VerifyCodeRegistrationResponseDTO,
} from "./verify_code_registration.dto";
import { VerifyCodeRegistrationRepository } from "../data/verify_code_registration.repository";

export class VerifyCodeRegistrationUseCase {
  constructor(private readonly repository: VerifyCodeRegistrationRepository) {}

  async execute(
    data: VerifyCodeRegistrationDTO
  ): Promise<VerifyCodeRegistrationResponseDTO> {
    const storedCode = await this.repository.getTemporaryCode(data.email);
    const userData = await this.repository.getTemporaryUser(data.email);

    if (!storedCode && !userData) {
      throw new AppError(
        "This code not exists",
        HttpStatusCodes.BAD_REQUEST.code
      );
    }

    if (!userData || !storedCode) {
      throw new AppError(
        "This code is expired",
        HttpStatusCodes.BAD_REQUEST.code
      );
    }

    const code: string = JSON.parse(storedCode).code;

    if (code !== data.code) {
      throw new AppError(
        "Invalid verification code",
        HttpStatusCodes.UNAUTHORIZED.code
      );
    }

    await this.repository.createUser(JSON.parse(userData));
    await this.repository.removeTemporaryUser(data.email);

    return { message: "User verified and registered successfully" };
  }
}
