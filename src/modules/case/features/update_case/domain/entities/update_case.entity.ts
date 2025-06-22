export interface UpdatedCaseEntity {
  id: number;
  title: string;
  category_id: number;
  urgency: string;
  is_public: boolean;
  reference_code: string | null;
}
