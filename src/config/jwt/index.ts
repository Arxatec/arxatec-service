// src/config/jwt/index.ts
import jwt, { SignOptions, Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import ms from "ms";
import { encrypt, decrypt } from "../../utils/encryption";

dotenv.config();

const JWT_SECRET: Secret = process.env.JWT_SECRET ?? "";
const JWT_EXPIRES_IN = "7d";
const CODE_EXPIRES_IN = "15m";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in .env file");
}

// 🔢 Genera un código aleatorio de 4 dígitos
export function generateVerificationCode(length = 4): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
}

// 📩 Crea un token con un código de verificación cifrado
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

// ✅ Verifica y decodifica el token con código
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

// 🔐 Genera un token general para sesión JWT
export function generateToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// 🔍 Verifica un token general
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// 🔄 Genera un token solo con email (opcional si usas otros flujos)
export function generateResetPasswordToken(
  email: string,
  expiresIn: number | ms.StringValue
): string {
  const options: SignOptions = { expiresIn };
  return jwt.sign({ email }, JWT_SECRET, options);
}
