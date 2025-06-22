// src/modules/cases/features/create_case/domain/entities/case.entity.ts

export interface CaseEntity {
  id: number;
  service_id: number;
  title: string;
  description: string;
  category_id: number;
  status_id: number;
  urgency: "alta" | "media" | "baja";
  is_public: boolean;
  reference_code?: string;
}
