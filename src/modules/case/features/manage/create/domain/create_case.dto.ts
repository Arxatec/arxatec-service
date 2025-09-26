// src/modules/cases/features/manage/create_case/domain/dtos/create_case.dto.ts
import { z } from "zod";
import { CreateCaseSchema } from "./create_case.schema";

export type CreateCaseDTO = z.infer<typeof CreateCaseSchema>;

export interface CreateCaseResponseDTO {
  message: string;
  case_id: string;
}
