import { z } from "zod";

export const CaseDetailParamsSchema = z.object({
  id: z.coerce.number().int().positive({ message: "Invalid case ID." }),
});
