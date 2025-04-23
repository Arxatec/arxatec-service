import { Request, Response } from "express";
import { ConfirmPasswordResetService } from "./confirm_password_reset.service";
import { HttpStatusCodes } from "../../../../../../constants";
import { AppError, buildHttpResponse } from "../../../../../../utils";
import {
  handleServerError,
  handleZodError,
} from "../../../../../../utils/error_handler";
import { ZodError } from "zod";
import { ConfirmPasswordResetSchema } from "../domain/confirm_password_reset.schema";

export class ConfirmPasswordResetController {
  constructor(private readonly service: ConfirmPasswordResetService) {}

  async confirmPasswordReset(req: Request, res: Response) {
    try {
      const data = ConfirmPasswordResetSchema.parse(req.body);
      const result = await this.service.confirmPasswordReset(data);

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
