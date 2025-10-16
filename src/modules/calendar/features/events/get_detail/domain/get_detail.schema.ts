// src/modules/calendar/features/events/get_detail/domain/get_detail.schema.ts
import { z } from "zod";
export const GetCalendarEventDetailSchema = z.object({
  id: z.string().uuid("El ID del evento debe ser UUID válido"),
});
