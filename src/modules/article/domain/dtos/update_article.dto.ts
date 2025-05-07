import { z } from "zod";
import { MESSAGES } from "../../../../constants/messages";

export const UpdateArticleSchema = z
  .object({
    title: z
      .string()
      .min(1, MESSAGES.ARTICLE.ARTICLE_ERROR_REQUIRED_TITLE)
      .optional(),
    categoryId: z.string({
      required_error: MESSAGES.ARTICLE.ARTICLE_ERROR_REQUIRED_CATEGORY,
    }),
  })
  .strict();

export type UpdateArticleDTO = z.infer<typeof UpdateArticleSchema>;
