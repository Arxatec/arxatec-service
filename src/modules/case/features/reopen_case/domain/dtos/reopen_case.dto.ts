import { z } from "zod";
import { ReopenCaseSchema } from "./reopen_case.schema";

export type ReopenCaseDTO = z.infer<typeof ReopenCaseSchema>;