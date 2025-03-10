import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
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
    (req as any).user = payload;
    next(); 
    return;
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado." });
    return;
  }
};