import { Request, Response } from "express";
import { confirmPasswordReset } from "./confirm_password_reset.service";
import { HttpStatusCodes } from "../../../../../../constants";
import { buildHttpResponse } from "../../../../../../utils";
import { ConfirmPasswordResetSchema } from "../domain/confirm_password_reset.schema";

export async function confirm(req: Request, res: Response) {
  const data = ConfirmPasswordResetSchema.parse(req.body);
  const result = await confirmPasswordReset(data);

  return res
    .status(HttpStatusCodes.CREATED.code)
    .json(
      buildHttpResponse(HttpStatusCodes.CREATED.code, result.message, req.path)
    );
}
