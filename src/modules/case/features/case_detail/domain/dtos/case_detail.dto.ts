import { z } from "zod";
import { CaseDetailParamsSchema } from "./case_detail.schema";

export type CaseDetailParamsDTO = z.infer<typeof CaseDetailParamsSchema>;
