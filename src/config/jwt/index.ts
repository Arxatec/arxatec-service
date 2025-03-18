// src/config/jwt/index.ts
import jwt, { SignOptions, Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import ms from "ms";

dotenv.config();

const JWT_SECRET: Secret = process.env.JWT_SECRET ?? "";
const JWT_EXPIRES_IN = "7d"; // Expiración general de JWT
const CODE_EXPIRES_IN = "15m"; // Expiración de los códigos de verificación

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in .env file");
}

// Generar código de 4 dígitos aleatorio
export function generateVerificationCode(length = 4): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
}

// Generar Token con Código de Verificación
export function generateCodeToken(
  email: string,
  type: "verification" | "password_reset"
): string {
  const code = generateVerificationCode(); // Código de 4 dígitos
  return jwt.sign({ email, code, type }, JWT_SECRET, {
    expiresIn: CODE_EXPIRES_IN,
  });
}

// Verificar Código en Token
export function verifyCodeToken(
  token: string
): { email: string; code: string; type: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as {
      email: string;
      code: string;
      type: string;
    };
  } catch {
    return null;
  }
}

// Generar Token de Sesión (Para autenticación)
export function generateToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verificar Token (Para autenticación)
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Generar Token de Recuperación de Contraseña
export function generateResetPasswordToken(
  email: string,
  expiresIn: number | ms.StringValue
): string {
  const options: SignOptions = { expiresIn };
  return jwt.sign({ email }, JWT_SECRET, options);
}
