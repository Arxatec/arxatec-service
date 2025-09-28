import { Request, Response } from "express";
import { HttpStatusCodes } from "../../../../../../constants";
import { buildHttpResponse } from "../../../../../../utils";
import { VerifyCodeRegistrationSchema } from "../domain/verify_code_registration.schema";
import { verifyCodeRegistration } from "./verify_code_registration.service";

export async function verifyCode(
  req: Request,
  res: Response
): Promise<Response> {
  const data = VerifyCodeRegistrationSchema.parse(req.body);
  const result = await verifyCodeRegistration(data);

  return res
    .status(HttpStatusCodes.CREATED.code)
    .json(
      buildHttpResponse(HttpStatusCodes.CREATED.code, result.message, req.path)
    );
}
