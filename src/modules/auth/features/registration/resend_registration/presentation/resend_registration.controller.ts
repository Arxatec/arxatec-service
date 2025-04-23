import { Request, Response } from "express";
import { ZodError } from "zod";
import { HttpStatusCodes } from "../../../../../../constants";
import { AppError, buildHttpResponse } from "../../../../../../utils";
import {
  handleServerError,
  handleZodError,
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
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json(buildHttpResponse(error.statusCode, error.message, req.path));
      }
      if (error instanceof ZodError) {
        const createdError = handleZodError(error, req);
        return res.status(createdError.status).json(createdError);
      }
      return handleServerError(res, req, error);
    }
  }
}
