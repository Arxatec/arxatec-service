import jwt, { SignOptions, Secret } from "jsonwebtoken";
import ms from "ms";
import { encrypt, decrypt } from "../../utils/encryption";
import { JWT_SECRET as JWT_SECRET_ENV } from "../env";

const JWT_SECRET: Secret = JWT_SECRET_ENV ?? "";
const JWT_EXPIRES_IN = "7d";
const CODE_EXPIRES_IN = "15m";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in .env file");
}

export function generateVerificationCode(length = 4): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
}

export function generateCodeToken(
  email: string,
  type: "verification" | "password_reset"
): string {
  const code = generateVerificationCode();
  const encryptedCode = encrypt(code);

  return jwt.sign({ email, code: encryptedCode, type }, JWT_SECRET, {
    expiresIn: CODE_EXPIRES_IN,
  });
}

export function verifyCodeToken(
  token: string
): { email: string; code: string; type: string } | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      email: string;
      code: string;
      type: string;
    };

    const decryptedCode = decrypt(payload.code);
    return {
      email: payload.email,
      code: decryptedCode,
      type: payload.type,
    };
  } catch {
    return null;
  }
}

export function generateToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function generateResetPasswordToken(
  email: string,
  expiresIn: number | ms.StringValue
): string {
  const options: SignOptions = { expiresIn };
  return jwt.sign({ email }, JWT_SECRET, options);
}
