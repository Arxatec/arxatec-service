import { Request, Response } from "express";
import { ConfirmPasswordResetService } from "./confirm_password_reset.service";
import { HttpStatusCodes } from "../../../../../../constants";
import { buildHttpResponse } from "../../../../../../utils";
import {
  handleServerError,
} from "../../../../../../utils/error_handler";
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
      return handleServerError(res, req, error);
    }
  }
}
