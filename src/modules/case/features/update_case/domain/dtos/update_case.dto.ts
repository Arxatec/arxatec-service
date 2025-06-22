import { z } from "zod";
import { UpdateCaseParamsSchema, UpdateCaseSchema } from "./update_case.schema";

export type UpdateCaseParamsDTO = z.infer<typeof UpdateCaseParamsSchema>;
export type UpdateCaseDTO = z.infer<typeof UpdateCaseSchema>;
