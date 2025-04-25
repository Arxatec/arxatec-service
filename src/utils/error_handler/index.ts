import { ZodError } from "zod";
import { Request, Response } from "express";
import { HttpStatusCodes } from "../../constants";
import { buildHttpResponse } from "../build_http_response";
import { AppError } from "../errors";

export function handleZodError(error: ZodError, req: Request) {
  const isExtraKeysError = error.errors.some(
    (err) => err.code === "unrecognized_keys"
  );
  if (isExtraKeysError) {
    return buildHttpResponse(
      HttpStatusCodes.BAD_REQUEST.code,
      error.errors[0].message,
      req.path
    );
  }
  return buildHttpResponse(
    HttpStatusCodes.BAD_REQUEST.code,
    error.errors[0].message,
    req.path
  );
}

export const handleServerError = (
  res: Response,
  req: Request,
  error: unknown
) => {
  if (error instanceof AppError) {
    return res
      .status(error.statusCode)
      .json(buildHttpResponse(error.statusCode, error.message, req.path));
  }

  if (error instanceof ZodError) {
    const zodResp = handleZodError(error, req);
    return res.status(zodResp.status).json(zodResp);
  }

  return res
    .status(HttpStatusCodes.INTERNAL_SERVER_ERROR.code)
    .json(
      buildHttpResponse(
        HttpStatusCodes.INTERNAL_SERVER_ERROR.code,
        JSON.stringify(error),
        req.path
      )
    );
};
