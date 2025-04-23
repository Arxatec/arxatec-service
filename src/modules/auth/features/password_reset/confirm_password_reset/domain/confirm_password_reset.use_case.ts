import { HttpStatusCodes } from "../../../../../../constants";
import { AppError } from "../../../../../../utils";
import { ConfirmPasswordResetRepository } from "../data/confirm_password_reset.repository";
import {
  ConfirmPasswordResetDTO,
  ConfirmPasswordResetResponseDTO,
} from "./confirm_password_reset.dto";
import bcrypt from "bcrypt";

export class ConfirmPasswordResetUseCase {
  constructor(private readonly repository: ConfirmPasswordResetRepository) {}

  async execute(
    data: ConfirmPasswordResetDTO
  ): Promise<ConfirmPasswordResetResponseDTO> {
    if (data.password !== data.confirm_password) {
      throw new AppError(
        "Passwords do not match",
        HttpStatusCodes.BAD_REQUEST.code
      );
    }
    const password = await bcrypt.hash(data.password, 10);
    await this.repository.updatePassword(data.email, password);
    return { message: "Password reset successfully" };
  }
}
