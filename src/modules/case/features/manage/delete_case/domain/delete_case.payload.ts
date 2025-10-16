// src/modules/cases/features/manage/delete_case/domain/delete_case.payload.ts
import z from "zod";
import { DeleteCaseParamsSchema } from "./delete_case.schema";

export type DeleteCaseParams = z.infer<typeof DeleteCaseParamsSchema>;

export interface DeleteCaseResponse {
  message: string;
  deleted_case_id: string;
}
