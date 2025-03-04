import { z } from "zod";

export const CreateArticleSchema = z.strictObject({
  userId: z.number(),
  title: z.string().min(1, "El título es obligatorio"),
  content: z.string().min(1, "El contenido es obligatorio"),
});

export type CreateArticleDTO = z.infer<typeof CreateArticleSchema>;
