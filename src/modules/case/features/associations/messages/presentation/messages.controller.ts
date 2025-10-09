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
  const user = (req as any).user as {
    id: string;
    user_type: "client" | "lawyer";
  };

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
  const user = (req as any).user as {
    id: string;
    user_type: "client" | "lawyer";
  };

  // Obtener parámetros de paginación de query params
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;

  // Validar parámetros de paginación
  if (page < 1) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST.code)
      .json(
        buildHttpResponse(
          HttpStatusCodes.BAD_REQUEST.code,
          "El número de página debe ser mayor a 0",
          req.path,
          null
        )
      );
  }

  if (limit < 1 || limit > 100) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST.code)
      .json(
        buildHttpResponse(
          HttpStatusCodes.BAD_REQUEST.code,
          "El límite debe estar entre 1 y 100",
          req.path,
          null
        )
      );
  }

  const result = await getMessageHistoryService(id, user, page, limit);

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
