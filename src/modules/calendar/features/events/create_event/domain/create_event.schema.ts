// src/modules/calendar/features/events/create_event/domain/create_event.schema.ts
import { z } from "zod";
import { calendar_event_status } from "@prisma/client";

export const CreateCalendarEventSchema = z
  .object({
    title: z
      .string({ required_error: "El título es obligatorio" })
      .min(3, "El título debe tener al menos 3 caracteres")
      .max(150, "El título no puede exceder 150 caracteres")
      .trim(),

    description: z
      .string()
      .max(2000, "La descripción no puede exceder 2000 caracteres")
      .optional(),

    start_date: z
      .string({ required_error: "La fecha de inicio es obligatoria" })
      .datetime("Formato de fecha inválido (ISO 8601 requerido)"),

    end_date: z
      .string({ required_error: "La fecha de fin es obligatoria" })
      .datetime("Formato de fecha inválido (ISO 8601 requerido)"),

    location: z
      .string()
      .max(150, "La ubicación no puede exceder 150 caracteres")
      .optional(),

    reminder_minutes: z
      .number()
      .int()
      .positive()
      .max(24 * 60)
      .optional(),

    status: z.nativeEnum(calendar_event_status).optional(), // por defecto 'pending' en Prisma

    case_id: z.string().uuid("El ID del caso debe ser UUID válido").optional(),
    client_id: z
      .string()
      .uuid("El ID del cliente debe ser UUID válido")
      .optional(),
  })
  .refine((data) => new Date(data.start_date) < new Date(data.end_date), {
    message: "La fecha/hora de inicio debe ser anterior a la de fin",
    path: ["end_date"],
  });
