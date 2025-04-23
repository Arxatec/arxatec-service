import { z } from "zod";
import { MESSAGES } from "../../../../constants/messages";

export const CreatePublicationSchema = z.object({
  title: z.string({
    required_error: MESSAGES.COMMUNITY.PUBLICATION_ERROR_REQUIRED_TITLE
  }).min(1, MESSAGES.COMMUNITY.PUBLICATION_ERROR_INVALID_TITLE_MIN_LENGTH),
  description: z.string({
    required_error: MESSAGES.COMMUNITY.PUBLICATION_ERROR_REQUIRED_DESCRIPTION
  }).min(1, MESSAGES.COMMUNITY.PUBLICATION_ERROR_INVALID_DESCRIPTION_MIN_LENGTH),
  multimedia: z.string().min(1).optional(),
  link: z.string().min(1).optional()
}).strict();

export type CreatePublicationDTO = z.infer<typeof CreatePublicationSchema>;
