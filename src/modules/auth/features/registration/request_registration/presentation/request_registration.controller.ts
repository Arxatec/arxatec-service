import { Request, Response } from "express";
import { HttpStatusCodes } from "../../../../../../constants";
import { buildHttpResponse } from "../../../../../../utils";
import {
  handleServerError,
} from "../../../../../../utils/error_handler";
import { RequestRegistrationSchema } from "../domain/request_registration.schema";
import { RequestRegistrationService } from "./request_registration.service";

export class RequestRegistrationController {
  constructor(private readonly service: RequestRegistrationService) {}

  async requestRegistration(req: Request, res: Response): Promise<Response> {
    try {
      const data = RequestRegistrationSchema.parse(req.body);
      const { message } = await this.service.requestRegistration(data);

      return res
        .status(HttpStatusCodes.OK.code)
        .json(buildHttpResponse(HttpStatusCodes.OK.code, message, req.path));
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }
}
