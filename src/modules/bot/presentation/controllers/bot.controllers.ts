import { Request, Response } from "express";
import { BotService } from "../services/bot.service";
import {
  handleServerError,
  handleZodError,
} from "../../../../utils/error_handler";
import { ZodError } from "zod";
import { HttpStatusCodes, MESSAGES } from "../../../../constants";
import { BotApi } from "../../data/api/bot.api";
import { SendMessageSchema } from "../../domain/schema/send_message.schema";
import { buildHttpResponse } from "../../../../utils";
import { SendMessageDTO } from "../../domain/dtos/send_message.dto";

const botRepository = new BotApi();
const botService = new BotService(botRepository);

export class BotController {
  async sendMessage(req: Request, res: Response): Promise<Response> {
    try {
      const data = SendMessageSchema.parse(req.body) as SendMessageDTO;
      const response = await botService.sendMessage(data.message);
      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            MESSAGES.BOT.SEND_MESSAGE_SUCCESS,
            req.path,
            response
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
