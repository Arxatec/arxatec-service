// src/modules/case/domain/entities/case.entity.ts

import { AttachmentEntity } from "./attachment.entity";
import { MessageEntity } from "./message.entity";
import { CaseHistoryEntity } from "./case_history.entity";

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
  created_at?: Date;

  attachments?: AttachmentEntity[];
  messages?: MessageEntity[];
  histories?: CaseHistoryEntity[];
}