import { generateVerificationCode } from "../../../../../../config/jwt";
import { sendEmail } from "../../../../../../utils/email_sender";
import {
  ResendRegistrationDTO,
  ResendRegistrationResponseDTO,
} from "./resend_registration.dto";
import { ResendRegistrationRepository } from "../data/resend_registration.repository";
import { AppError } from "../../../../../../utils";
import { HttpStatusCodes } from "../../../../../../constants";
import path from "path";
import ejs from "ejs";

export class ResendRegistrationUseCase {
  constructor(private readonly repository: ResendRegistrationRepository) {}

  async execute(
    data: ResendRegistrationDTO
  ): Promise<ResendRegistrationResponseDTO> {
    const user = await this.repository.getTemporaryUser(data.email);
    if (!user) {
      throw new AppError("User not found", HttpStatusCodes.NOT_FOUND.code);
    }

    const code = generateVerificationCode();
    await this.repository.createTemporaryCode(data.email, code);

    const filePath = path.join(
      process.cwd(),
      "public",
      "templates",
      "verification_code.ejs"
    );

    const subject = "Verificación de cuenta - Arxatec";
    const text = `Tu código de verificación es: ${code}`;
    const html = await ejs.renderFile(filePath, { code });

    await sendEmail(data.email, subject, text, html);

    return { message: "Verification code resend sent successfully." };
  }
}
