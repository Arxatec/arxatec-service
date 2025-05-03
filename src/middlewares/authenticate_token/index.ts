// src/middlewares/authenticate_token/index.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: { id: number; email?: string; role: "client" | "lawyer" };
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {                    
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Falta el header de autorización." });
    return;                  
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET || "clave_por_defecto";

  try {
    const payload: any = jwt.verify(token, secret);

    req.user = {
      id:   payload.id,
      email: payload.email,
      role: payload.user_type as "client" | "lawyer",
    };

    next();                  
  } catch {
    res.status(401).json({ error: "Token inválido o expirado." });
  }
}
