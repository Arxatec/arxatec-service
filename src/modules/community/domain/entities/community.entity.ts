export interface Community {
  id: number;
  name: string;
  description?: string;
  banner?: string;
  icon?: string;
  category_id?: number;
  creator_user_id: number;
}
