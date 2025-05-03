// src/utils/error_handler/index.ts
import { ZodError } from "zod";
import { Request, Response } from "express";
import { HttpStatusCodes } from "../../constants";
import { buildHttpResponse } from "../build_http_response";
import { AppError } from "../errors";

export function handleZodError(error: ZodError, req: Request) {
  const isExtraKeysError = error.errors.some(
    (err) => err.code === "unrecognized_keys"
  );

  const message = isExtraKeysError
    ? error.errors[0].message
    : error.errors[0].message;

  return buildHttpResponse(HttpStatusCodes.BAD_REQUEST.code, message, req.path);
}

export const handleServerError = (
  res: Response,
  req: Request,
  error: unknown
) => {
  if (error instanceof ZodError) {
    const zodError = handleZodError(error, req);
    return res.status(zodError.status).json(zodError);
  }

  if (error instanceof AppError) {
    return res
      .status(error.statusCode)
      .json(buildHttpResponse(error.statusCode, error.message, req.path));
  }

  return res
    .status(HttpStatusCodes.INTERNAL_SERVER_ERROR.code)
    .json(
      buildHttpResponse(
        HttpStatusCodes.INTERNAL_SERVER_ERROR.code,
        process.env.NODE_ENV === "production"
          ? "Internal Server Error"
          : JSON.stringify(error, null, 2),
        req.path
      )
    );
};
