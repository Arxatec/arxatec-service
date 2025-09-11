// src/modules/auth/features/password_reset/request_password_reset/presentation/request_password_reset.controller.ts
import { Request, Response } from "express";
import { HttpStatusCodes } from "../../../../../../constants";
import { buildHttpResponse } from "../../../../../../utils";
import { RequestPasswordResetSchema } from "../domain/request_password_reset.schema";
import { RequestPasswordResetService } from "./request_password_reset.service";

export class RequestPasswordResetController {
  constructor(private readonly service: RequestPasswordResetService) {}

  async requestPasswordReset(req: Request, res: Response): Promise<Response> {
    const data = RequestPasswordResetSchema.parse(req.body);
    const response = await this.service.requestPasswordReset(data);

    return res
      .status(HttpStatusCodes.OK.code)
      .json(
        buildHttpResponse(HttpStatusCodes.OK.code, response.message, req.path)
      );
  }
}
