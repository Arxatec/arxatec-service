import { z } from "zod";

export const EmailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(5),
  text: z.string().min(5),
  html: z.string().optional(),
});

export type EmailDTO = z.infer<typeof EmailSchema>;
