import { z } from "zod";

export const ReopenCaseSchema = z.object({
  id: z.number({ required_error: "Case ID is required" }).int().positive(),
});