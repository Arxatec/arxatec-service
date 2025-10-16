// src/modules/calendar/features/events/update_all/domain/update_all.schema.ts
import { z } from "zod";
import { calendar_event_status } from "@prisma/client";

export const UpdateCalendarEventParamsSchema = z.object({
  id: z.string().uuid("El ID del evento debe ser UUID válido"),
});

export const UpdateCalendarEventBodySchema = z
  .object({
    title: z.string().min(3).max(150).trim().optional(),
    description: z.string().max(2000).optional(),
    start_date: z.string().datetime().optional(),
    end_date: z.string().datetime().optional(),
    location: z.string().max(150).optional(),
    reminder_minutes: z
      .number()
      .int()
      .positive()
      .max(24 * 60)
      .optional(),
    status: z.nativeEnum(calendar_event_status).optional(),
    case_id: z.string().uuid().nullable().optional(),
    client_id: z.string().uuid().nullable().optional(),
  })
  .refine(
    (d) => {
      if (d.start_date && d.end_date)
        return new Date(d.start_date) < new Date(d.end_date);
      return true;
    },
    {
      message: "La fecha/hora de inicio debe ser anterior a la de fin",
      path: ["end_date"],
    }
  );
