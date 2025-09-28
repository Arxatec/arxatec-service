import { Request, Response } from "express";
import { HttpStatusCodes } from "../../../../../../constants";
import { buildHttpResponse } from "../../../../../../utils";
import { RequestPasswordResetSchema } from "../domain/request_password_reset.schema";
import { requestPasswordReset } from "./request_password_reset.service";

export async function request(req: Request, res: Response): Promise<Response> {
  const data = RequestPasswordResetSchema.parse(req.body);
  const response = await requestPasswordReset(data);

  return res
    .status(HttpStatusCodes.OK.code)
    .json(
      buildHttpResponse(HttpStatusCodes.OK.code, response.message, req.path)
    );
}
