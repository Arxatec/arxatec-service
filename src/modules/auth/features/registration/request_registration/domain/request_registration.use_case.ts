import { AppError } from "../../../../../../utils";
import { HttpStatusCodes } from "../../../../../../constants";
import { generateVerificationCode } from "../../../../../../config/jwt";
import { sendEmail } from "../../../../../../utils/email_sender";
import { RequestRegistrationRepository } from "../data/request_registration.repository";
import {
  RequestRegistrationDTO,
  RequestRegistrationResponseDTO,
} from "./request_registration.dto";
import path from "path";
import ejs from "ejs";
import bcrypt from "bcrypt";

export class RequestRegistrationUseCase {
  constructor(private readonly repository: RequestRegistrationRepository) {}

  async execute(
    data: RequestRegistrationDTO
  ): Promise<RequestRegistrationResponseDTO> {
    const existingUser = await this.repository.getEmail(data.email);
    if (existingUser) {
      throw new AppError(
        "Email is already in use",
        HttpStatusCodes.BAD_REQUEST.code
      );
    }
    const dataEncrypted = {
      ...data,
      password: await bcrypt.hash(data.password, 10),
    };

    const code = generateVerificationCode();
    await this.repository.createTemporaryUser(dataEncrypted, code);

    const filePath = path.join(
      process.cwd(),
      "public",
      "templates",
      "verification_code.ejs"
    );

    const subject = "Verifica tu cuenta de Arxatec";
    const text = `Tu código de verificación es: ${code}`;
    const html = await ejs.renderFile(filePath, { code });

    await sendEmail(data.email, subject, text, html);
    return { message: "Verification code sent successfully." };
  }
}
