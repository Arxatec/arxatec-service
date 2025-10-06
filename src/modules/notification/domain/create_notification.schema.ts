// src/modules/notification/features/notification/domain/create_notification.schema.ts
import { z } from "zod";

export const CreateNotificationSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  type: z.enum(["info", "success", "error", "alert"]),
  receiverId: z.string().uuid("receiverId debe ser UUID"),
  senderId: z.string().uuid("senderId debe ser UUID").optional(),
  url: z.string().url("URL inválida").optional(),
});
