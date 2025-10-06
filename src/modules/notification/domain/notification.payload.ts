// src/modules/notification/features/notification/domain/notification.payload.ts
import { z } from "zod";
import { CreateNotificationSchema } from "./create_notification.schema";

export type CreateNotificationRequest = z.infer<
  typeof CreateNotificationSchema
>;

export type NotificationItem = {
  id: string; 
  title: string;
  description: string;
  type: "info" | "success" | "error" | "alert";
  createdAt: Date;
  receiverId: string;
  senderId?: string | null;
  url?: string | null;
};

export type CreateNotificationResponse = {
  message: string;
  notification: NotificationItem;
};

export type GetNotificationsResponse = {
  message: string;
  notifications: NotificationItem[];
};

export type DeleteNotificationResponse = {
  message: string;
};
