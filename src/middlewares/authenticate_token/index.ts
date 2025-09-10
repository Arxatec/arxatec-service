// src/middlewares/authenticate_token/index.ts
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../../config";
import { HttpStatusCodes } from "../../constants";
import { buildHttpResponse } from "../../utils";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    user_type: "admin" | "client" | "employee";
  };
}

interface TokenPayload {
  id: string;
  user_type: "admin" | "client" | "employee";
  //admin_role?: "superadmin" | "manager"
  email?: string;
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res
        .status(HttpStatusCodes.UNAUTHORIZED.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.UNAUTHORIZED.code,
            "Authorization header required",
            req.path
          )
        );
    }

    const token = authHeader.split(" ")[1];
    if (!JWT_SECRET) {
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.INTERNAL_SERVER_ERROR.code,
            "JWT secret not configured",
            req.path
          )
        );
    }

    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload & TokenPayload;

    req.user = {
      id: payload.id,
      email: payload.email,
      user_type: payload.user_type,
    };

    return next();
  } catch (error) {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED.code)
      .json(
        buildHttpResponse(
          HttpStatusCodes.UNAUTHORIZED.code,
          "Invalid or expired token",
          req.path
        )
      );
  }
}
