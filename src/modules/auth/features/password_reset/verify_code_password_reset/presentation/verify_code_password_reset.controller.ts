import { Request, Response } from "express";
import { VerifyCodePasswordResetService } from "./verify_code_password_reset.service";
import { VerifyCodePasswordResetSchema } from "../domain/verify_code_password_reset.schema";
import { HttpStatusCodes } from "../../../../../../constants";
import { buildHttpResponse } from "../../../../../../utils";
import { handleServerError } from "../../../../../../utils/error_handler";

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
      return handleServerError(res, req, error);
    }
  }
}
