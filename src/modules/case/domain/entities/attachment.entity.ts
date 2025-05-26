// src/modules/case/domain/entities/attachment.entity.ts
export interface AttachmentEntity {
  id:           number;
  service_id:   number;
  file_key:     string;
  label:        string;
  description?: string;
  category_id:  number;
  uploaded_by:  "lawyer" | "client";
  archived:     boolean;
  created_at:   Date;
}