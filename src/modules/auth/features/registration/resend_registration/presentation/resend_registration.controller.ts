import { Request, Response } from "express";
import { HttpStatusCodes } from "../../../../../../constants";
import { buildHttpResponse } from "../../../../../../utils";
import { ResendRegistrationSchema } from "../domain/resend_registration.schema";
import { resendRegistration } from "./resend_registration.service";

export async function resend(req: Request, res: Response): Promise<Response> {
  const data = ResendRegistrationSchema.parse(req.body);
  const { message } = await resendRegistration(data);

  return res
    .status(HttpStatusCodes.OK.code)
    .json(buildHttpResponse(HttpStatusCodes.OK.code, message, req.path));
}
