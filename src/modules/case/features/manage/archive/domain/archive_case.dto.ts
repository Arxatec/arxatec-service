// src/modules/cases/features/manage/archive/domain/archive_case.payload.ts
import z from "zod";
import { ArchiveCaseSchema } from "./archive_case.schema";

export type ArchiveCaseRequest = z.infer<typeof ArchiveCaseSchema>;

export interface ArchiveCaseResponse {
  message: string;
}
