// src/modules/auth/features/registration/request_reqistration/presentation/request_registration.controller.ts
import { Request, Response } from "express";
import { HttpStatusCodes } from "../../../../../../constants";
import { buildHttpResponse } from "../../../../../../utils";
import { RequestRegistrationSchema } from "../domain/request_registration.schema";
import { RequestRegistrationService } from "./request_registration.service";

export class RequestRegistrationController {
  constructor(private readonly service: RequestRegistrationService) {}

  async requestRegistration(req: Request, res: Response): Promise<Response> {
    const data = RequestRegistrationSchema.parse(req.body);
    const { message } = await this.service.requestRegistration(data);

    return res
      .status(HttpStatusCodes.OK.code)
      .json(buildHttpResponse(HttpStatusCodes.OK.code, message, req.path));
  }
}
