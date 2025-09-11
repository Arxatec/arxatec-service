// src/modules/auth/features/password_reset/verify_code_password_reset/presentation/verify_code_password_reset.controller.ts
import { Request, Response } from "express";
import { VerifyCodePasswordResetService } from "./verify_code_password_reset.service";
import { VerifyCodePasswordResetSchema } from "../domain/verify_code_password_reset.schema";
import { HttpStatusCodes } from "../../../../../../constants";
import { buildHttpResponse } from "../../../../../../utils";

export class VerifyCodePasswordResetController {
  constructor(private readonly service: VerifyCodePasswordResetService) {}

  async verifyCodePasswordReset(req: Request, res: Response) {
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
  }
}
