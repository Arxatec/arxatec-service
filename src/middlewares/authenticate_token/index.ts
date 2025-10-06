// src/middlewares/authenticate_token/index.ts
import type { Request, RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../../config";
import { HttpStatusCodes } from "../../constants";
import { buildHttpResponse } from "../../utils";

interface TokenPayload {
  id: string;
  user_type: "admin" | "client" | "lawyer";
  email?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        user_type: "admin" | "client" | "lawyer";
      };
    }
  }
}

export type CurrentUser = NonNullable<Express.Request["user"]>;
export type AuthenticatedRequest = Request & { user: CurrentUser };

export const authenticateToken: RequestHandler = (req, res, next) => {
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

    next();
  } catch {
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
};
