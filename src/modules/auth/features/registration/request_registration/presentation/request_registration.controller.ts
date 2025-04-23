import { Request, Response } from "express";
import { ZodError } from "zod";
import { HttpStatusCodes } from "../../../../../../constants";
import { AppError, buildHttpResponse } from "../../../../../../utils";
import {
  handleServerError,
  handleZodError,
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
      console.log(error);
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
