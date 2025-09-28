import { Request, Response } from "express";
import { VerifyCodePasswordResetSchema } from "../domain/verify_code_password_reset.schema";
import { HttpStatusCodes } from "../../../../../../constants";
import { buildHttpResponse } from "../../../../../../utils";
import { verifyCodePasswordReset } from "./verify_code_password_reset.service";

export async function verifyCode(req: Request, res: Response) {
  const data = VerifyCodePasswordResetSchema.parse(req.body);
  const result = await verifyCodePasswordReset(data);

  return res
    .status(HttpStatusCodes.CREATED.code)
    .json(
      buildHttpResponse(HttpStatusCodes.CREATED.code, result.message, req.path)
    );
}
