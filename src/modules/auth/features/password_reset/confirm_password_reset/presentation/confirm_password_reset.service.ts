import { HttpStatusCodes } from "../../../../../../constants";
import { AppError } from "../../../../../../utils";
import { updatePassword } from "../data/confirm_password_reset.repository";
import {
  ConfirmPasswordResetRequest,
  ConfirmPasswordResetResponse,
} from "../domain/confirm_password_reset.payload";
import bcrypt from "bcrypt";
import { removeTemporaryCode } from "../../verify_code_password_reset/data/verify_code_password_reset.repository";

export async function confirmPasswordReset(
  data: ConfirmPasswordResetRequest
): Promise<ConfirmPasswordResetResponse> {
  const normalizedEmail = data.email.trim().toLowerCase();
  const hashed = await bcrypt.hash(data.password, 10);

  const updated = await updatePassword(normalizedEmail, hashed);
  if (!updated) {
    throw new AppError("Usuario no encontrado", HttpStatusCodes.NOT_FOUND.code);
  }

  await removeTemporaryCode(normalizedEmail);

  return { message: "Contraseña restablecida correctamente." };
}
