import { z } from "zod";
import { MESSAGES } from "../../../../constants/messages";

export const CreateArticleSchema = z
  .strictObject({
    title: z
      .string({ required_error: MESSAGES.ARTICLE.ARTICLE_ERROR_REQUIRED_TITLE })
      .min(1, MESSAGES.ARTICLE.ARTICLE_ERROR_REQUIRED_TITLE),
    categoryId: z.string({
      required_error: MESSAGES.ARTICLE.ARTICLE_ERROR_REQUIRED_CATEGORY,
    }),
  })
  .strict();

export type CreateArticleDTO = z.infer<typeof CreateArticleSchema>;
