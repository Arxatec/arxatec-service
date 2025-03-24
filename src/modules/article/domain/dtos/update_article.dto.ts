import { z } from "zod";
import { MESSAGES } from "../../../../constants/messages";

export const UpdateArticleSchema = z.object({
  title: z.string().min(1, MESSAGES.ARTICLE.ARTICLE_ERROR_REQUIRED_TITLE).optional(),
  content: z.string().min(1, MESSAGES.ARTICLE.ARTICLE_ERROR_REQUIRED_CONTENT).optional(),
  categoryId: z.number().optional(),
  banner: z.string().min(1, MESSAGES.ARTICLE.ARTICLE_ERROR_REQUIRED_BANNER).optional(),
}).strict();

export type UpdateArticleDTO = z.infer<typeof UpdateArticleSchema>;
