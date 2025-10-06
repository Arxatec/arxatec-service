// src/modules/case/features/messages/presentation/messages.controller.ts
import { Request, Response } from "express";
import { HttpStatusCodes } from "../../../../../../constants";
import { buildHttpResponse } from "../../../../../../utils";
import { SendMessageSchema } from "../domain/send_message.schema";
import { CaseIdParamsSchema } from "../domain/case_params.schema";
import {
  getMessageHistoryService,
  sendMessageService,
} from "./message.service";

export async function send(req: Request, res: Response): Promise<Response> {
  const { id } = CaseIdParamsSchema.parse(req.params);
  const body = SendMessageSchema.parse(req.body);
  const user = (req as any).user as { id: string; role: "client" | "lawyer" };

  const result = await sendMessageService(id, body, user);

  return res
    .status(HttpStatusCodes.CREATED.code)
    .json(
      buildHttpResponse(
        HttpStatusCodes.CREATED.code,
        result.message,
        req.path,
        result.data
      )
    );
}

export async function getHistory(
  req: Request,
  res: Response
): Promise<Response> {
  const { id } = CaseIdParamsSchema.parse(req.params);
  const user = (req as any).user as { id: string; role: "client" | "lawyer" };

  const result = await getMessageHistoryService(id, user);

  return res
    .status(HttpStatusCodes.OK.code)
    .json(
      buildHttpResponse(
        HttpStatusCodes.OK.code,
        result.message,
        req.path,
        result.data
      )
    );
}
