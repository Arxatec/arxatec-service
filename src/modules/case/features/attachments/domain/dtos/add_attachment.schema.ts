import { z } from "zod";

export const AddAttachmentSchema = z.object({
  caseId: z.coerce.number({ required_error: "Case ID is required" }).int().positive(),
  category_id: z.coerce.number({ required_error: "Category is required" }).int().positive(),
  label: z.string().min(1, "Label is required").max(100),
  description: z.string().max(255).optional(),
  file_key: z.string().min(5, "Invalid file key"),
});
