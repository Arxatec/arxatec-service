import { AppError } from "../../../../../../utils";
import { HttpStatusCodes } from "../../../../../../constants";
import {
  VerifyCodeRegistrationRequest,
  VerifyCodeRegistrationResponse,
} from "../domain/verify_code_registration.payload";
import {
  createUser,
  getTemporaryCode,
  getTemporaryUser,
  removeTemporaryUser,
} from "../data/verify_code_registration.repository";

export async function verifyCodeRegistration(
  data: VerifyCodeRegistrationRequest
): Promise<VerifyCodeRegistrationResponse> {
  const normalizedEmail = data.email.trim().toLowerCase();

  const storedCode = await getTemporaryCode(normalizedEmail);
  const userData = await getTemporaryUser(normalizedEmail);

  if (!storedCode || !userData) {
    throw new AppError(
      "Código expirado o no encontrado, solicita uno nuevo.",
      HttpStatusCodes.BAD_REQUEST.code
    );
  }

  let parsedCode: { email: string; code: string } | null = null;
  let parsedUser: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  } | null = null;

  try {
    parsedCode = JSON.parse(storedCode);
    parsedUser = JSON.parse(userData);
  } catch {
    await removeTemporaryUser(normalizedEmail);
    throw new AppError(
      "Código inválido, solicita uno nuevo.",
      HttpStatusCodes.BAD_REQUEST.code
    );
  }

  if (!parsedCode?.code || parsedCode.code !== data.code) {
    throw new AppError(
      "Código de verificación inválido, por favor verifica que el código sea correcto.",
      HttpStatusCodes.UNAUTHORIZED.code
    );
  }

  if (
    !parsedUser?.email ||
    parsedUser.email.toLowerCase() !== normalizedEmail ||
    !parsedUser.first_name ||
    !parsedUser.last_name ||
    !parsedUser.password
  ) {
    await removeTemporaryUser(normalizedEmail);
    throw new AppError(
      "Datos temporales inválidos, solicita un nuevo código.",
      HttpStatusCodes.BAD_REQUEST.code
    );
  }

  try {
    await createUser({
      ...parsedUser,
      confirm_password: parsedUser.password,
    });
  } catch (err: any) {
    if (err?.code === "P2002") {
      throw new AppError(
        "El correo electrónico ya está registrado.",
        HttpStatusCodes.CONFLICT.code
      );
    }
    throw err;
  }

  await removeTemporaryUser(normalizedEmail);
  return { message: "User verified and registered successfully" };
}


