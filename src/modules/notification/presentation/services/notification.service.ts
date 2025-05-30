// src/modules/notification/presentation/services/notification.service.ts

import { CreateNotificationDto } from "../../domain/dtos/createNotification.dto";
import { NotificationRepository } from "../../data/repository/notification.repository";
import { NotificationEntity } from "../../domain/entities/notification.entity";
import { AppError } from "../../../../utils/errors";
import { HttpStatusCodes } from "../../../../constants/http_status_codes";
import { io } from "../../../../config/socket";

export class NotificationService {
  constructor(private readonly notificationRepo: NotificationRepository) {}

  async createNotification(dto: CreateNotificationDto): Promise<NotificationEntity> {

    const created = await this.notificationRepo.createNotification(dto);

    io.to(`user:${created.receiverId}`).emit("notificacion_recibida", {
      id: created.id,
      title: created.title,
      description: created.description,
      type: created.type,
      createdAt: created.createdAt,
      receiverId: created.receiverId,
      senderId: created.senderId ?? null,
      url: created.url?? null,
    });

    return NotificationEntity.fromPrisma(created);
  }

  async getUserNotifications(userId: number): Promise<NotificationEntity[]> {
    const notifs = await this.notificationRepo.getNotificationsByReceiverId(userId);
    return notifs.map(NotificationEntity.fromPrisma);
  }

  async deleteNotification(notificationId: number, userId: number): Promise<void> {
    const result = await this.notificationRepo.deleteNotification(notificationId, userId);
    
    if (result.count === 0) {
      throw new AppError(
        "Notification not found or unauthorized",
        HttpStatusCodes.NOT_FOUND.code
      );
    }
  }
}
