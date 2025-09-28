import { HttpStatusCodes } from "../../../../../../constants";
import { AppError } from "../../../../../../utils";
import {
  getTemporaryCode,
  removeTemporaryCode,
  incrementAttempts,
  resetAttempts,
  getCodeTTLSeconds,
  syncAttemptsTTL,
} from "../data/verify_code_password_reset.repository";
import {
  VerifyCodePasswordResetRequest,
  VerifyCodePasswordResetResponse,
} from "../domain/verify_code_password_reset.payload";

const MAX_ATTEMPTS = 5;

export async function verifyCodePasswordReset(
  data: VerifyCodePasswordResetRequest
): Promise<VerifyCodePasswordResetResponse> {
  const email = data.email.trim().toLowerCase();

  const codeTtl = await getCodeTTLSeconds(email);
  if (codeTtl && codeTtl > 0) {
    await syncAttemptsTTL(email, codeTtl);
  }

  const attempts = await incrementAttempts(email);
  if (attempts > MAX_ATTEMPTS) {
    await removeTemporaryCode(email);
    await resetAttempts(email);
    throw new AppError(
      "Se superó el máximo de intentos. Solicita un nuevo código.",
      HttpStatusCodes.BAD_REQUEST.code
    );
  }

  const stored = await getTemporaryCode(email);
  if (!stored) {
    throw new AppError(
      "Código no encontrado o expirado, solicita uno nuevo.",
      HttpStatusCodes.BAD_REQUEST.code
    );
  }

  let parsed: { email: string; code: string } | null = null;
  try {
    parsed = JSON.parse(stored);
  } catch {
    await removeTemporaryCode(email);
    await resetAttempts(email);
    throw new AppError(
      "Código inválido, solicita uno nuevo.",
      HttpStatusCodes.BAD_REQUEST.code
    );
  }

  if (!parsed?.code || parsed.code !== data.code) {
    throw new AppError(
      "Código inválido, verifica que sea correcto.",
      HttpStatusCodes.BAD_REQUEST.code
    );
  }

  await removeTemporaryCode(email);
  await resetAttempts(email);

  return { message: "Código verificado correctamente." };
}
