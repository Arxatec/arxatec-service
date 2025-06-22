// src/middlewares/multer_error_handler/multer_error_handler.ts
import { Request, Response, NextFunction } from "express";
import { buildHttpResponse } from "../../utils/build_http_response";
import { HttpStatusCodes } from "../../constants/http_status_codes";
import { CASE_MESSAGES } from "../../constants/messages/case";

export function multerErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  if (err instanceof Error && err.message === "ONLY_IMAGE_FILES_ALLOWED") {
    return res.status(HttpStatusCodes.BAD_REQUEST.code).json(
      buildHttpResponse(
        HttpStatusCodes.BAD_REQUEST.code,
        HttpStatusCodes.BAD_REQUEST.message,
        req.path,
        CASE_MESSAGES.ONLY_IMAGE_FILES_ALLOWED
      )
    );
  }

  return next(err);
}
