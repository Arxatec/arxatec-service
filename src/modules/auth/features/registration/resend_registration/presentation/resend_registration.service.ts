// src/modules/auth/features/registration/resend_registration/presentation/resend_registration.service.ts

import { generateVerificationCode } from "../../../../../../infrastructure/jwt";
import { sendEmail } from "../../../../../../utils/email_sender";
import {
  getTemporaryUser,
  getTemporaryCode,
  createTemporaryCode,
} from "../data/resend_registration.repository";
import { AppError } from "../../../../../../utils";
import { HttpStatusCodes } from "../../../../../../constants";
import path from "path";
import ejs from "ejs";
import {
  ResendRegistrationRequest,
  ResendRegistrationResponse,
} from "../domain/resend_registration.payload";

export async function resendRegistration(
  data: ResendRegistrationRequest
): Promise<ResendRegistrationResponse> {
  const normalizedEmail = data.email.trim().toLowerCase();

  const userPayloadRaw = await getTemporaryUser(normalizedEmail);
  if (!userPayloadRaw) {
    throw new AppError(
      "Usuario no encontrado, por favor verifica que el correo electrónico sea correcto.",
      HttpStatusCodes.NOT_FOUND.code
    );
  }

  let codeToSend: string | null = null;
  const existingCodeRaw = await getTemporaryCode(normalizedEmail);

  if (existingCodeRaw) {
    try {
      const parsed = JSON.parse(existingCodeRaw) as {
        email: string;
        code: string;
      };
      if (parsed?.code) codeToSend = parsed.code;
    } catch {
      codeToSend = null;
    }
  }

  if (!codeToSend) {
    const newCode = generateVerificationCode();
    await createTemporaryCode(normalizedEmail, newCode);
    codeToSend = newCode;
  }

  await sendVerificationCode(normalizedEmail, codeToSend);
  return { message: "Código de verificación reenviado correctamente." };
}

async function sendVerificationCode(
  email: string,
  code: string
): Promise<void> {
  const filePath = path.join(
    process.cwd(),
    "public",
    "templates",
    "verification_code.ejs"
  );
  const subject = "Verificación de cuenta - Arxatec";
  const text = `Tu código de verificación es: ${code}`;
  const html = await ejs.renderFile(filePath, { code });

  await sendEmail(email, subject, text, html);
}
