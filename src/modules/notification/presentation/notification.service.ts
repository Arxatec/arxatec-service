// src/modules/notification/features/notification/presentation/notification.service.ts
import {
  CreateNotificationRequest,
  CreateNotificationResponse,
  DeleteNotificationResponse,
  GetNotificationsResponse,
  NotificationItem,
} from "../domain/notification.payload";
import {
  createNotificationRepo,
  deleteNotificationRepo,
  getNotificationsByReceiverIdRepo,
} from "../data/notification.repository";
import { AppError } from "../../../utils";
import { HttpStatusCodes } from "../../../constants";
import { io } from "../../../config/socket";

export async function createNotificationService(
  dto: CreateNotificationRequest
): Promise<CreateNotificationResponse> {
  const created = await createNotificationRepo(dto);

  io.to(`user:${created.receiver_id}`).emit("notificacion_recibida", {
    id: created.id,
    title: created.title,
    description: created.description,
    type: created.type,
    createdAt: created.created_at,
    receiverId: created.receiver_id,
    senderId: created.sender_id ?? null,
    url: created.url ?? null,
  });

  const notification: NotificationItem = {
    id: created.id,
    title: created.title,
    description: created.description,
    type: created.type as NotificationItem["type"],
    createdAt: created.created_at,
    receiverId: created.receiver_id,
    senderId: created.sender_id ?? null,
    url: created.url ?? null,
  };

  return { message: "Notificación creada correctamente.", notification };
}

export async function getUserNotificationsService(
  userId: string // UUID
): Promise<GetNotificationsResponse> {
  const notifs = await getNotificationsByReceiverIdRepo(userId);

  const notifications: NotificationItem[] = notifs.map((n) => ({
    id: n.id,
    title: n.title,
    description: n.description,
    type: n.type as NotificationItem["type"],
    createdAt: n.created_at,
    receiverId: n.receiver_id,
    senderId: n.sender_id ?? null,
    url: n.url ?? null,
  }));

  return { message: "Notificaciones obtenidas correctamente.", notifications };
}

export async function deleteNotificationService(
  notificationId: string, 
  userId: string 
): Promise<DeleteNotificationResponse> {
  const result = await deleteNotificationRepo(notificationId, userId);

  if (result.count === 0) {
    throw new AppError(
      "Notificación no encontrada o no autorizada.",
      HttpStatusCodes.NOT_FOUND.code
    );
  }

  return { message: "Notificación eliminada correctamente." };
}
