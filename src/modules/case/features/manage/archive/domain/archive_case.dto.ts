// src/modules/cases/features/manage/archive/domain/archive_case.dto.ts
import { z } from "zod";
import { ArchiveCaseSchema } from "./archive_case.schema";

export type ArchiveCaseDTO = z.infer<typeof ArchiveCaseSchema>;
