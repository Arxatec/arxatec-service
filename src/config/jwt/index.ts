// src/shared/config/jwt.ts
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from "dotenv";
import ms from 'ms';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("Revisa el .env");
}
const JWT_EXPIRES_IN = '7d'; 

// Token del Email
export const generateVerificationToken = (email: string): string => {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
};

// Token Payload
export const generateToken = (payload: any): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Verificacion
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null; 
  }
};

// Token de recuperar contraseña
export const generateResetPasswordToken = (email: string, expiresIn: number | ms.StringValue): string => {
  const options: SignOptions = { expiresIn };
  return jwt.sign({ email }, process.env.JWT_SECRET as string, options);
};