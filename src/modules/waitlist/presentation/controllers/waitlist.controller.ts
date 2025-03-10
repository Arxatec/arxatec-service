import { Request, Response } from "express";
import { SubscribeDTO, SubscribeSchema } from "../../domain/dtos/waitlist.dto";
import { WaitlistRepository } from "../../data/repository/waitlist.repository";
import { WaitlistService } from "../services/waitlist.service";
import { handleServerError, handleZodError } from "../../../../utils/error_handler";
import { ZodError } from "zod";
import { buildHttpResponse } from "../../../../utils";
import { HttpStatusCodes } from "../../../../constants";

const waitlistRepository = new WaitlistRepository();
const waitlistService = new WaitlistService(waitlistRepository);

export class WaitlistController {
  async subscribeController(req: Request, res: Response): Promise<Response> {
    try {
      const data = SubscribeSchema.parse(req.body) as SubscribeDTO;
      const message = await waitlistService.subscribeToUpdates(data);

      return res.status(HttpStatusCodes.CREATED.code).json(
        buildHttpResponse(
          HttpStatusCodes.CREATED.code,
          message,
          req.path
        )
      );
    } catch (error) {
      if (error instanceof ZodError) {
        const createdError = handleZodError(error, req);
        return res.status(createdError.status).json(createdError);
      }
      return handleServerError(res, req, error);
    }
  }
}
