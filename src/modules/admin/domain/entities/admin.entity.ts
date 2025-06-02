// src/modules/admin/domain/entities/admin.entity.ts
export interface ArticleCategory {
  id: number;
  name: string;
  description: string | null;
}

export interface ServiceCategory {
  id: number;
  name: string;
  description: string | null;
}

export interface CommunityCategory {
  id: number;
  name: string;
  description: string | null;
}

export interface CaseCategory {
  id: number;
  name: string;
  description: string | null;
}

export interface CaseStatus {
  id: number;
  name: string;
  description: string | null;
}

export interface AttachmentCategory {
  id: number;
  name: string;
}
