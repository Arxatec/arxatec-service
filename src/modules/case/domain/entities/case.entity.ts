// src/modules/case/domain/entities/case.entity.ts
export interface CaseEntity {
  id: number;
  title: string;
  description: string;
  category: "labor" | "family" | "personal" | "corporate" | "other";
  type: "consultation" | "case" | "advisory";
  isPublic: boolean;
  status: "open" | "taken" | "in_progress" | "closed" | "archived";
  archived: boolean;
  createdAt: Date;
  clientId?: number;
  lawyerId?: number;
  externalClientId?: number;
}