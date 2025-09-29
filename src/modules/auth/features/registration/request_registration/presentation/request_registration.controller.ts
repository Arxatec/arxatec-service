import { Request, Response } from "express";
import { HttpStatusCodes } from "../../../../../../constants";
import { buildHttpResponse } from "../../../../../../utils";
import { RequestRegistrationSchema } from "../domain/request_registration.schema";
import { requestRegistration } from "./request_registration.service";

export async function request(req: Request, res: Response): Promise<Response> {
  console.log("request");
  const data = RequestRegistrationSchema.parse(req.body);
  const { message } = await requestRegistration(data);

  return res
    .status(HttpStatusCodes.OK.code)
    .json(buildHttpResponse(HttpStatusCodes.OK.code, message, req.path));
}
