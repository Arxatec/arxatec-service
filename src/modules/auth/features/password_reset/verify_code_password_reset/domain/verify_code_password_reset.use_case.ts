import { HttpStatusCodes } from "../../../../../../constants";
import { AppError } from "../../../../../../utils";
import { VerifyCodePasswordResetRepository } from "../data/verify_code_password_reset.repository";
import {
  VerifyCodePasswordResetDTO,
  VerifyCodePasswordResetResponseDTO,
} from "./verify_code_password_reset.dto";
export class VerifyCodePasswordResetUseCase {
  constructor(private readonly repository: VerifyCodePasswordResetRepository) {}

  async execute(
    data: VerifyCodePasswordResetDTO
  ): Promise<VerifyCodePasswordResetResponseDTO> {
    const storedCode = await this.repository.getTemporaryCode(data.email);
    if (!storedCode) {
      throw new AppError("Code not found", HttpStatusCodes.BAD_REQUEST.code);
    }

    const code = JSON.parse(storedCode).code;

    if (code !== data.code) {
      throw new AppError("Invalid code", HttpStatusCodes.BAD_REQUEST.code);
    }

    await this.repository.removeTemporaryCode(data.email);

    return { message: "Code verified successfully" };
  }
}
