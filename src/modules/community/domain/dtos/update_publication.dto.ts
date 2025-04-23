import { z } from "zod";

export const UpdatePublicationSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  multimedia: z.string().min(1).optional(),
  link: z.string().min(1).optional()
}).strict();

export type UpdatePublicationDTO = z.infer<typeof UpdatePublicationSchema>;
