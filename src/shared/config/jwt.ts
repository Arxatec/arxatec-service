// src/shared/config/jwt.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'clave_secreta';
const JWT_EXPIRES_IN = '7d';

export const generateToken = (payload: any): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};