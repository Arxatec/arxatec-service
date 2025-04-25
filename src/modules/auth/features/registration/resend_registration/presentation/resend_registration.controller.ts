import { Request, Response } from "express";
import { HttpStatusCodes } from "../../../../../../constants";
import { buildHttpResponse } from "../../../../../../utils";
import {
  handleServerError,
} from "../../../../../../utils/error_handler";
import { ResendRegistrationSchema } from "../domain/resend_registration.schema";
import { ResendRegistrationService } from "./resend_registration.service";

export class ResendRegistrationController {
  constructor(private readonly service: ResendRegistrationService) {}

  async resendRegistration(req: Request, res: Response): Promise<Response> {
    try {
      const data = ResendRegistrationSchema.parse(req.body);
      const response = await this.service.resendRegistration(data);

      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(HttpStatusCodes.OK.code, response.message, req.path)
        );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }
}
