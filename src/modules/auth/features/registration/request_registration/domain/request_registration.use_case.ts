// src/modules/auth/features/registration/request_reqistration/domain/request_registration.use_case.ts
import { AppError } from "../../../../../../utils";
import { HttpStatusCodes } from "../../../../../../constants";
import { generateVerificationCode } from "../../../../../../infrastructure/jwt";
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
    const normalizedEmail = data.email.trim().toLowerCase();

    const existingUser = await this.repository.getByEmail(normalizedEmail);
    if (existingUser) {
      throw new AppError(
        "El correo electrónico ya está en uso, por favor verifica que el correo electrónico sea correcto.",
        HttpStatusCodes.BAD_REQUEST.code
      );
    }

    // Encriptamos password ANTES de almacenar en Redis
    const dataEncrypted = {
      ...data,
      email: normalizedEmail,
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

    await sendEmail(normalizedEmail, subject, text, html);

    // No devolver el código por seguridad
    return { message: "Verification code sent successfully." };
  }
}
