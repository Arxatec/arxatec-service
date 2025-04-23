export interface Publication {
  id: number;
  title: string;
  description: string;
  multimedia?: string;
  link?: string;
  community_id: number;
  community_user_id: number;
  created_at: Date;
}
