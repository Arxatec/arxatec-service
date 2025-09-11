// src/modules/auth/features/registration/resend_registration/presentation/resend_registration.controller.ts
import { Request, Response } from "express";
import { HttpStatusCodes } from "../../../../../../constants";
import { buildHttpResponse } from "../../../../../../utils";
import { ResendRegistrationSchema } from "../domain/resend_registration.schema";
import { ResendRegistrationService } from "./resend_registration.service";

export class ResendRegistrationController {
  constructor(private readonly service: ResendRegistrationService) {}

  async resendRegistration(req: Request, res: Response): Promise<Response> {
    const data = ResendRegistrationSchema.parse(req.body);
    const { message } = await this.service.resendRegistration(data);

    return res
      .status(HttpStatusCodes.OK.code)
      .json(buildHttpResponse(HttpStatusCodes.OK.code, message, req.path));
  }
}
