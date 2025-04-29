// src/modules/case/domain/entities/case_history.entity.ts
export interface CaseHistoryEntity {
    id: number;
    caseId: number;
    changedBy: number;
    field: string;
    oldValue?: string | null;
    newValue?: string | null;
    createdAt: Date;
  }
  