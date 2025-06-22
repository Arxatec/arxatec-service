import { z } from "zod";
import { ArchiveCaseSchema } from "./archive_case.schema";

export type ArchiveCaseDTO = z.infer<typeof ArchiveCaseSchema>;