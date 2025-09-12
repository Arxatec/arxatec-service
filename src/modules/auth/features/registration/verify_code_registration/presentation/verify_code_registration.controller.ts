// src/modules/auth/features/registration/verify_code_registration/presentation/verify_code_registration.controller.ts
import { Request, Response } from "express";
import { HttpStatusCodes } from "../../../../../../constants";
import { buildHttpResponse } from "../../../../../../utils";
import { VerifyCodeRegistrationSchema } from "../domain/verify_code_registration.schema";
import { VerifyCodeRegistrationService } from "./verify_code_registration.service";

export class VerifyCodeRegistrationController {
  constructor(private readonly service: VerifyCodeRegistrationService) {}

  async verifyCodeRegistration(req: Request, res: Response): Promise<Response> {
    const data = VerifyCodeRegistrationSchema.parse(req.body);
    const result = await this.service.verifyCodeRegistration(data);

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
