// src/modules/case/features/messages/domain/send_message.schema.ts
import { z } from "zod";

export const SendMessageSchema = z.object({
  content: z
    .string({ required_error: "El contenido es obligatorio" })
    .min(1, "El mensaje no puede estar vacío")
    .max(2000, "El mensaje no debe superar 2000 caracteres"),
});
