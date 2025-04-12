// src/middlewares/authenticate_token.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * Define un tipo que extiende la Request de Express con la propiedad user
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email?: string;
    // Agrega otros campos que necesites
  };
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "Falta el header de autorización." });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Token no proporcionado." });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || "clave_por_defecto";
    const payload = jwt.verify(token, secret);
    req.user = payload as AuthenticatedRequest["user"];
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado." });
  }
}
