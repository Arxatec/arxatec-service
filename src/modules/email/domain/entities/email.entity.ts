// src/modules/email/domain/dtos/email.entity.ts

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
