import { z } from "zod";

export const BulkEmailSchema = z.object({
  subject: z.string().min(5, "Subject must have at least 5 characters"),
  text: z.string().min(5, "Text must have at least 5 characters"),
  html: z.string().optional(),
  user_type: z.enum(["client", "lawyer", "admin"]).optional(), // Opcional, si no se envía, enviará a todos
});

export type BulkEmailDTO = z.infer<typeof BulkEmailSchema>;
