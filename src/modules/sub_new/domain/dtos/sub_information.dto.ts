import { z } from "zod";

export const SubscribeSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Debe ser un correo válido"),
});

export type SubscribeDTO = z.infer<typeof SubscribeSchema>;