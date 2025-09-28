import { generateVerificationCode } from "../../../../../../infrastructure/jwt";
import { sendEmail } from "../../../../../../utils/email_sender";
import {
  RequestPasswordResetRequest,
  RequestPasswordResetResponse,
} from "../domain/request_password_reset.payload";
import {
  getByEmailPasswordReset,
  createTemporaryCode,
} from "../data/request_password_reset.repository";
import { AppError } from "../../../../../../utils";
import { HttpStatusCodes } from "../../../../../../constants";
import path from "path";
import ejs from "ejs";

export async function requestPasswordReset(
  data: RequestPasswordResetRequest
): Promise<RequestPasswordResetResponse> {
  const user = await getByEmailPasswordReset(data.email);
  if (!user) {
    throw new AppError(
      "El usuario no existe, por favor verifica que el correo electrónico sea correcto.",
      HttpStatusCodes.NOT_FOUND.code
    );
  }

  const code = generateVerificationCode();
  await createTemporaryCode(user.email, code);
  await sendRecoveryCode(user.email, code);

  return { message: "Código de verificación enviado correctamente." };
}

async function sendRecoveryCode(email: string, code: string) {
  const filePath = path.join(
    process.cwd(),
    "public",
    "templates",
    "recovery_code.ejs"
  );
  const subject = "Recuperación de cuenta - Arxatec";
  const text = `Tu código de verificación es: ${code}`;
  const html = await ejs.renderFile(filePath, { code });

  await sendEmail(email, subject, text, html);
}
