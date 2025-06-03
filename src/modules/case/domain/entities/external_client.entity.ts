// src/modules/case/domain/entities/external_client.entity.ts
export interface ExternalClientEntity {
  id: number;
  user_detail_id: number;
  full_name: string;
  email: string | null;
  phone: string;
  dni: string;
  created_at: Date;
  archived: boolean;
}