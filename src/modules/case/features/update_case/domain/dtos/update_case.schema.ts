import { z } from "zod";

export const UpdateCaseParamsSchema = z.object({
  id: z.coerce.number().int().positive({ message: "Invalid case ID." }),
});

export const UpdateCaseSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).optional(),
  category_id: z.number().int().positive().optional(),
  urgency: z.enum(["baja", "media", "alta"]).optional(),
  is_public: z.boolean().optional(),
  reference_code: z.string().max(50).optional(),
});
