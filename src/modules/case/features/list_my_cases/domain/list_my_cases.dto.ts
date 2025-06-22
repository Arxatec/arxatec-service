// src/modules/cases/features/list_my_cases/domain/list_my_cases.dto.ts
import { z } from "zod";
import { ListMyCasesSchema } from "./list_my_cases.schema";

export type ListMyCasesDTO = z.infer<typeof ListMyCasesSchema>;

export interface ListMyCasesResponseDTO {
  id: number;
  title: string;
  status_id: number;
  category_id: number;
  is_public: boolean;
  created_at: Date;
}
