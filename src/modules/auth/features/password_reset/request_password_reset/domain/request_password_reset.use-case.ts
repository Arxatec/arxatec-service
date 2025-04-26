import { generateVerificationCode } from "../../../../../../config/jwt";
import { sendEmail } from "../../../../../../utils/email_sender";
import {
  RequestPasswordResetDTO,
  RequestPasswordResetResponseDTO,
} from "./request_password_reset.dto";
import { RequestPasswordResetRepository } from "../data/request_password_reset.repository";
import { AppError } from "../../../../../../utils";
import { HttpStatusCodes } from "../../../../../../constants";
import path from "path";
import ejs from "ejs";

export class RequestPasswordResetUseCase {
  constructor(private readonly repository: RequestPasswordResetRepository) {}

  async execute(
    data: RequestPasswordResetDTO
  ): Promise<RequestPasswordResetResponseDTO> {
    const user = await this.repository.getEmail(data.email);
    if (!user) {
      throw new AppError("User not found", HttpStatusCodes.NOT_FOUND.code);
    }

    const code = generateVerificationCode();
    await this.repository.createTemporaryCode(user.email, code);

    const filePath = path.join(
      process.cwd(),
      "public",
      "templates",
      "recovery_code.ejs"
    );
    const subject = "Recuperación de cuenta - Arxatec";
    const text = `Tu código de verificación es: ${code}`;
    const html = await ejs.renderFile(filePath, { code });

    await sendEmail(user.email, subject, text, html);

    return { message: code };
  }
}
