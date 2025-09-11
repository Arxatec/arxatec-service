// src/modules/auth/features/registration/resend_registration/domain/resend_registration.use_case.ts
import { generateVerificationCode } from "../../../../../../infrastructure/jwt";
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
    const normalizedEmail = data.email.trim().toLowerCase();

    // Debe existir el payload temporal del usuario (protegemos el flujo)
    const userPayloadRaw = await this.repository.getTemporaryUser(
      normalizedEmail
    );
    if (!userPayloadRaw) {
      throw new AppError("User not found", HttpStatusCodes.NOT_FOUND.code);
    }

    // 1) intenta reutilizar el código vigente (si existe)
    let codeToSend: string | null = null;
    const existingCodeRaw = await this.repository.getTemporaryCode(
      normalizedEmail
    );

    if (existingCodeRaw) {
      try {
        const parsed = JSON.parse(existingCodeRaw) as {
          email: string;
          code: string;
        };
        if (parsed?.code) codeToSend = parsed.code;
      } catch {
        // si está corrupto, lo ignoramos y generamos uno nuevo
        codeToSend = null;
      }
    }

    // 2) si no hay código vigente, genera uno nuevo y crea la clave con NX
    if (!codeToSend) {
      const newCode = generateVerificationCode();
      await this.repository.createTemporaryCode(normalizedEmail, newCode);
      codeToSend = newCode;
    }

    // Render del email
    const filePath = path.join(
      process.cwd(),
      "public",
      "templates",
      "verification_code.ejs"
    );
    const subject = "Verificación de cuenta - Arxatec";
    const text = `Tu código de verificación es: ${codeToSend}`;
    const html = await ejs.renderFile(filePath, { code: codeToSend });

    await sendEmail(normalizedEmail, subject, text, html);

    // No devolver el código por seguridad
    return { message: "Verification code resent successfully." };
  }
}
