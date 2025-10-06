import type { PaginationMeta } from "../../../../../../utils/pagination";

export interface ListMyCasesItem {
  id: string;
  title: string;
  status: string;
  category: string;
  is_public: boolean;
  created_at: Date;
}

export interface ListMyCasesResponse {
  items: ListMyCasesItem[];
  meta: PaginationMeta;
}
