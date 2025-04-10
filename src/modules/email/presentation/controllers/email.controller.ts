
// src/modules/email/presentation/controllers/email.controller.ts
import { Request, Response } from "express";
import { EmailService } from "../services/email.service";
import { VerifyCodeSchema } from "../../domain/dtos/verify_code.dto";
import { handleServerError, handleZodError } from "../../../../utils/error_handler";
import { BulkEmailSchema, BulkEmailDTO } from "../../domain/dtos/bulk_email.dto";

import { ZodError } from "zod";
import { HttpStatusCodes } from "../../../../constants";
import { buildHttpResponse } from "../../../../utils";

const emailService = new EmailService();

export class EmailController {
  async sendVerificationEmail(req: Request, res: Response) {
    try {
      const { email } = req.body;
      await emailService.sendVerificationCode(email);
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(HttpStatusCodes.OK.code, "Verification email sent", req.path)
      );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }

  async verifyEmail(req: Request, res: Response) {
    try {
      const data = VerifyCodeSchema.parse(req.body);
      const response = await emailService.verifyCode(data.code);
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(HttpStatusCodes.OK.code, response.message, req.path)
      );
    } catch (error) {
      if (error instanceof ZodError) {
        const createdError = handleZodError(error, req);
        return res.status(createdError.status).json(createdError);
      }
      return handleServerError(res, req, error);
    }
  }
  //Correo Masivo
  async sendBulkEmail(req: Request, res: Response): Promise<Response> {
    try {
      const data = BulkEmailSchema.parse(req.body) as BulkEmailDTO;
      const response = await emailService.sendBulkEmail(data);

      return res
        .status(HttpStatusCodes.OK.code)
        .json(buildHttpResponse(HttpStatusCodes.OK.code, response.message, req.path));
    } catch (error) {
      if (error instanceof ZodError) {
        const createdError = handleZodError(error, req);
        return res.status(createdError.status).json(createdError);
      }
      return handleServerError(res, req, error);
    }
  }
}
