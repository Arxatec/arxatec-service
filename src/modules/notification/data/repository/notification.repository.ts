import { PrismaClient } from "@prisma/client";
import { CreateNotificationDto } from "../../domain/dtos/createNotification.dto";

const prisma = new PrismaClient();

export class NotificationRepository {
  async createNotification(data: CreateNotificationDto) {
    return prisma.notification.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        receiverId: data.receiverId,
        senderId: data.senderId,
        url: data.url
      },
    });
  }

  async getNotificationsByReceiverId(receiverId: number) {
    return prisma.notification.findMany({
      where: { receiverId },
      orderBy: { createdAt: "desc" },
    });
  }

  async deleteNotification(id: number, userId: number) {
    return prisma.notification.deleteMany({
      where: {
        id,
        receiverId: userId,
      },
    });
  }
}
