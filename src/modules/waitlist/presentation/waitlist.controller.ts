// src/modules/waitlist/presentation/waitlist.controller.ts
import { Request, Response } from "express";
import { SubscribeSchema } from "../domain/waitlist.schema";
import { WaitlistService } from "./waitlist.service";
import {
  handleServerError,
  handleZodError,
} from "../../../utils/error_handler";
import { ZodError } from "zod";
import { buildHttpResponse } from "../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../constants/http_status_codes";

export class WaitlistController {
  constructor(private readonly svc = new WaitlistService()) {}

  subscribe = async (req: Request, res: Response) => {
    try {
      const dto = SubscribeSchema.parse(req.body);
      const message = await this.svc.subscribeToUpdates(dto);

      return res
        .status(HttpStatusCodes.CREATED.code)
        .json(
          buildHttpResponse(HttpStatusCodes.CREATED.code, message, req.path)
        );
    } catch (err) {
      if (err instanceof ZodError) {
        const z = handleZodError(err, req);
        return res.status(z.status).json(z);
      }
      return handleServerError(res, req, err);
    }
  };
}
