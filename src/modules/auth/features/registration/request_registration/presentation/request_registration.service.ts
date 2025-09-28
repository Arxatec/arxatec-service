import {
  RequestRegistrationRequest,
  RequestRegistrationResponse,
} from "../domain/request_registration.payload";
import { AppError } from "../../../../../../utils";
import { HttpStatusCodes } from "../../../../../../constants";
import { generateVerificationCode } from "../../../../../../infrastructure/jwt";
import { sendEmail } from "../../../../../../utils/email_sender";
import {
  getByEmailRegistration,
  createTemporaryUser,
} from "../data/request_registration.repository";
import path from "path";
import ejs from "ejs";
import bcrypt from "bcrypt";

export async function requestRegistration(
  data: RequestRegistrationRequest
): Promise<RequestRegistrationResponse> {
  const normalizedEmail = data.email.trim().toLowerCase();
  const existingUser = await getByEmailRegistration(normalizedEmail);

  if (existingUser) {
    throw new AppError(
      "El correo electrónico ya está en uso, por favor verifica que el correo electrónico sea correcto.",
      HttpStatusCodes.BAD_REQUEST.code
    );
  }

  const dataEncrypted = {
    ...data,
    email: normalizedEmail,
    password: await bcrypt.hash(data.password, 10),
  };

  const code = generateVerificationCode();
  await createTemporaryUser(dataEncrypted, code);

  await sendVerificationCode(normalizedEmail, code);
  return { message: "Código de verificación enviado correctamente." };
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
  const subject = "Verifica tu cuenta de Arxatec";
  const text = `Tu código de verificación es: ${code}`;
  const html = await ejs.renderFile(filePath, { code });

  await sendEmail(email, subject, text, html);
}
