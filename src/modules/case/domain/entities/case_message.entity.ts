// src/modules/case/domain/entities/case_message.entity.ts
export interface CaseMessageEntity {
    id: number;
    caseId: number;
    senderId: number;
    content: string;
    createdAt: Date;
  }