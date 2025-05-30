// src/modules/case/domain/entities/case_history.entity.ts
export interface CaseHistoryEntity {
  id: number;
  case_id: number;
  changed_by: number;
  field: string;
  old_value: string;
  new_value: string;
  note?: string;
  created_at?: Date;
}
