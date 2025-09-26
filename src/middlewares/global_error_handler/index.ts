// src/middlewares/global_error_handler/index.ts
import { Request, Response, NextFunction } from "express";
import { handleServerError } from "../../utils/error_handler";

export function globalErrorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  return handleServerError(res, req, err);
}
