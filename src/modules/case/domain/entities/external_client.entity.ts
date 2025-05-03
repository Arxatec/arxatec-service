// src/modules/case/domain/entities/external_client.entity.ts
export interface ExternalClientEntity {
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  }
  