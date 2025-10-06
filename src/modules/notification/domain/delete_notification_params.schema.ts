// src/modules/notification/features/notification/domain/delete_notification_params.schema.ts
import { z } from "zod";

export const DeleteNotificationParamsSchema = z.object({
  id: z.string().uuid("El ID debe ser UUID válido"),
});
