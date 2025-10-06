// src/modules/cases/features/manage/create_case/domain/create_case.payload.ts
import { z } from "zod";
import { CreateCaseSchema } from "./create_case.schema";

export type CreateCaseRequest = z.infer<typeof CreateCaseSchema>;

export interface CreateCaseResponse {
  message: string;
  case: {
    id: string;
    service_id: string;
    title: string;
    description: string;
    category: string;
    status: string;
    urgency: string;
    is_public: boolean;
    reference_code?: string;
  };
}
