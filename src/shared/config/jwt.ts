// src/shared/config/jwt.ts
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

// Asegúrate de que JWT_SECRET esté definido en el entorno
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