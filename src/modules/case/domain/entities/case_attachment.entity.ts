// src/modules/case/domain/entities/case_attachment.entity.ts
export interface CaseAttachmentEntity {
    id: number;
    caseId: number;
    fileUrl: string;
    filename?: string;
    archived: boolean;
    uploadedBy: number;
    uploadedAt: Date;
  }
  