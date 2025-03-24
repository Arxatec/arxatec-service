import { z } from "zod";
import { MESSAGES } from "../../../../constants/messages";

export const CreateArticleSchema = z.strictObject({
  title: z.string({ required_error: MESSAGES.ARTICLE.ARTICLE_ERROR_REQUIRED_TITLE })
          .min(1, MESSAGES.ARTICLE.ARTICLE_ERROR_REQUIRED_TITLE),
  content: z.string({ required_error: MESSAGES.ARTICLE.ARTICLE_ERROR_REQUIRED_CONTENT })
            .min(1, MESSAGES.ARTICLE.ARTICLE_ERROR_REQUIRED_CONTENT),
  categoryId: z.number({ required_error: MESSAGES.ARTICLE.ARTICLE_ERROR_REQUIRED_CATEGORY }),
  banner: z.string({ required_error: MESSAGES.ARTICLE.ARTICLE_ERROR_REQUIRED_BANNER })
           .min(1, MESSAGES.ARTICLE.ARTICLE_ERROR_REQUIRED_BANNER),
}).strict();

export type CreateArticleDTO = z.infer<typeof CreateArticleSchema>;
