// src/modules/notification/presentation/controllers/notification.controller.ts

import { Response } from "express";
import { NotificationService } from "../services/notification.service";
import { CreateNotificationSchema } from "../../domain/dtos/createNotification.dto";
import {
  handleServerError,
  handleZodError,
} from "../../../../utils/error_handler";
import { buildHttpResponse } from "../../../../utils/build_http_response";
import { HttpStatusCodes, MESSAGES } from "../../../../constants";
import { ZodError } from "zod";
import { AuthenticatedRequest } from "../../../../middlewares/authenticate_token";

export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const body = CreateNotificationSchema.parse(req.body);
      const notification = await this.notificationService.createNotification(body);

      return res.status(HttpStatusCodes.CREATED.code).json(
        buildHttpResponse(
          HttpStatusCodes.CREATED.code,
          MESSAGES.NOTIFICATION.CREATED,
          req.path,
          notification
        )
      );
    } catch (error) {
      if (error instanceof ZodError) {
        const zodErrorObject = handleZodError(error, req);
        return res.status(HttpStatusCodes.BAD_REQUEST.code).json(zodErrorObject);
      }
      return handleServerError(res, req, error);
    }
  }

  async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const notifications = await this.notificationService.getUserNotifications(userId);

      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          MESSAGES.NOTIFICATION.FETCHED,
          req.path,
          notifications
        )
      );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const notificationId = parseInt(req.params.id, 10);

      await this.notificationService.deleteNotification(notificationId, userId);

      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          MESSAGES.NOTIFICATION.DELETED,
          req.path
        )
      );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }
}
