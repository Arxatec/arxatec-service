import { z } from "zod";

export const CreateNotificationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["info", "success", "error", "alert"]),
  receiverId: z.number().int().positive("Receiver ID must be a valid user ID"),
  senderId: z.number().int().positive("Sender ID must be a valid user ID").optional(),
  url: z.string().url().optional(),
});

export type CreateNotificationDto = z.infer<typeof CreateNotificationSchema>;
