// src/modules/case/domain/entities/message.entity.ts
export interface MessageEntity {
  id: number;
  service_id: number;
  content: string;
  sent_by: "lawyer" | "client";
  is_read: boolean;
  created_at: Date;
}