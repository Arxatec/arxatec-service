//src/modules/calendar/features/events/update_hour/domain/update_hour.schema.ts
import { z } from "zod";

export const UpdateCalendarEventTimeSchema = z
  .object({
    start_date: z
      .string({ required_error: "La fecha de inicio es obligatoria" })
      .datetime("Formato de fecha inválido"),
    end_date: z
      .string({ required_error: "La fecha de fin es obligatoria" })
      .datetime("Formato de fecha inválido"),
  })
  .refine((d) => new Date(d.start_date) < new Date(d.end_date), {
    message: "La fecha de inicio debe ser anterior a la de fin",
    path: ["end_date"],
  });
