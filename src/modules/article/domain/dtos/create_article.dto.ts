import { z } from "zod";

export const CreateArticleSchema = z.strictObject({
  title: z.string().min(1, "El título es obligatorio"),
  content: z.string().min(1, "El contenido es obligatorio"),
  categoryId: z.number({ required_error: "La categoría es obligatoria" }),
  banner: z.string().optional(),
});

export type CreateArticleDTO = z.infer<typeof CreateArticleSchema>;
