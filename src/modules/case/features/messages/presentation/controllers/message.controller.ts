// src/modules/case/features/messages/controllers/message.controller.ts
import { MessageService } from "../services/message.service";
import { MessageHistoryService } from "../services/message_history.service";
import { Response } from "express";
import { AuthenticatedRequest } from "../../../../../../middlewares/authenticate_token";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { handleServerError } from "../../../../../../utils/error_handler";

export class MessageController {
  constructor(
    private readonly messageService = new MessageService(),
    private readonly messageHistoryService = new MessageHistoryService()
  ) {}

  send = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const dto = req.body;
      const caseId = Number(req.params.id);
      const user = req.user!;

      const message = await this.messageService.send(caseId, dto, user);

      return res.status(HttpStatusCodes.CREATED.code).json(
        buildHttpResponse(
          HttpStatusCodes.CREATED.code,
          "Message sent successfully",
          req.path,
          { message }
        )
      );
    } catch (err) {
      return handleServerError(res, req, err);
    }
  };

  getHistory = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const caseId = Number(req.params.id);
      const user = req.user!;

      const messages = await this.messageHistoryService.getMessageHistory(caseId, user);

      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          "Messages fetched successfully",
          req.path,
          { messages }
        )
      );
    } catch (err) {
      return handleServerError(res, req, err);
    }
  };
}
