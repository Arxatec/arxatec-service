import { Request, Response } from "express";
import { VerifyCodePasswordResetService } from "./verify_code_password_reset.service";
import { VerifyCodePasswordResetSchema } from "../domain/verify_code_password_reset.schema";
import { HttpStatusCodes } from "../../../../../../constants";
import { AppError, buildHttpResponse } from "../../../../../../utils";
import {
  handleServerError,
  handleZodError,
} from "../../../../../../utils/error_handler";
import { ZodError } from "zod";

export class VerifyCodePasswordResetController {
  constructor(private readonly service: VerifyCodePasswordResetService) {}

  async verifyCodePasswordReset(req: Request, res: Response) {
    try {
      const data = VerifyCodePasswordResetSchema.parse(req.body);
      const result = await this.service.verifyCodePasswordReset(data);

      return res
        .status(HttpStatusCodes.CREATED.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.CREATED.code,
            result.message,
            req.path
          )
        );
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json(buildHttpResponse(error.statusCode, error.message, req.path));
      }
      if (error instanceof ZodError) {
        const createdError = handleZodError(error, req);
        return res.status(createdError.status).json(createdError);
      }
      return handleServerError(res, req, error);
    }
  }
}
