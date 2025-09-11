// src/modules/auth/features/password_reset/confirm_password_reset/presentation/confirm_password_reset.controller.ts
import { Request, Response } from "express";
import { ConfirmPasswordResetService } from "./confirm_password_reset.service";
import { HttpStatusCodes } from "../../../../../../constants";
import { buildHttpResponse } from "../../../../../../utils";
import { ConfirmPasswordResetSchema } from "../domain/confirm_password_reset.schema";

export class ConfirmPasswordResetController {
  constructor(private readonly service: ConfirmPasswordResetService) {}

  async confirmPasswordReset(req: Request, res: Response) {
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
  }
}
