import { z } from "zod";

export const CreateReactionSchema = z.object({
  target_id: z.number(),
  target_type: z.enum(["publication", "comment", "reply"]),
  type: z.enum(["like", "dislike"])
});

export type CreateReactionDTO = z.infer<typeof CreateReactionSchema>;
