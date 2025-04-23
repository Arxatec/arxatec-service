import { Request, Response } from "express";
import { ZodError } from "zod";
import { HttpStatusCodes } from "../../../../../../constants";
import { AppError, buildHttpResponse } from "../../../../../../utils";
import {
  handleServerError,
  handleZodError,
} from "../../../../../../utils/error_handler";
import { VerifyCodeRegistrationSchema } from "../domain/verify_code_registration.schema";
import { VerifyCodeRegistrationService } from "./verify_code_registration.service";

export class VerifyCodeRegistrationController {
  constructor(private readonly service: VerifyCodeRegistrationService) {}

  async verifyCodeRegistration(req: Request, res: Response): Promise<Response> {
    try {
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
