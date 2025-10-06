// src/modules/notification/features/notification/presentation/notification.controller.ts
import { Request, Response } from "express";
import { HttpStatusCodes } from "../../../constants";
import { buildHttpResponse } from "../../../utils";
import { CreateNotificationSchema } from "../domain/create_notification.schema";
import { DeleteNotificationParamsSchema } from "../domain/delete_notification_params.schema";
import {
  createNotificationService,
  deleteNotificationService,
  getUserNotificationsService,
} from "./notification.service";

export async function create(req: Request, res: Response): Promise<Response> {
  const body = CreateNotificationSchema.parse(req.body);
  const result = await createNotificationService(body);

  return res
    .status(HttpStatusCodes.CREATED.code)
    .json(
      buildHttpResponse(
        HttpStatusCodes.CREATED.code,
        result.message,
        req.path,
        result.notification
      )
    );
}

export async function getAll(req: Request, res: Response): Promise<Response> {
  const userId = (req as any).user?.id as string | undefined;
  if (!userId) throw new Error("Usuario no autenticado");

  const result = await getUserNotificationsService(userId);

  return res
    .status(HttpStatusCodes.OK.code)
    .json(
      buildHttpResponse(
        HttpStatusCodes.OK.code,
        result.message,
        req.path,
        result.notifications
      )
    );
}

export async function remove(req: Request, res: Response): Promise<Response> {
  const userId = (req as any).user?.id as string | undefined; 
  if (!userId) throw new Error("Usuario no autenticado");

  const { id } = DeleteNotificationParamsSchema.parse(req.params);
  const result = await deleteNotificationService(id, userId);

  return res
    .status(HttpStatusCodes.OK.code)
    .json(buildHttpResponse(HttpStatusCodes.OK.code, result.message, req.path));
}
