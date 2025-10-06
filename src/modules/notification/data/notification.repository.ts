// src/modules/notification/features/notification/data/notification.repository.ts
import prisma from "../../../config/prisma_client";
import { notifications } from "@prisma/client";

type CreateRepoDTO = {
  title: string;
  description: string;
  type: "info" | "success" | "error" | "alert";
  receiverId: string;
  senderId?: string | null;
  url?: string | null;
};

export async function createNotificationRepo(
  data: CreateRepoDTO
): Promise<notifications> {
  return prisma.notifications.create({
    data: {
      title: data.title,
      description: data.description,
      type: data.type,
      receiver_id: data.receiverId,
      sender_id: data.senderId ?? null,
      url: data.url ?? null,
    },
  });
}

export async function getNotificationsByReceiverIdRepo(
  receiverId: string
): Promise<notifications[]> {
  return prisma.notifications.findMany({
    where: { receiver_id: receiverId },
    orderBy: { created_at: "desc" },
  });
}

export async function deleteNotificationRepo(
  id: string,
  userId: string 
): Promise<{ count: number }> {
  return prisma.notifications.deleteMany({
    where: { id, receiver_id: userId },
  });
}
