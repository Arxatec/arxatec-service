export interface Reaction {
  id: number;
  target_id: number;
  target_type: "publication" | "comment" | "reply";
  type: "like" | "dislike";
  user_id: number;
  created_at: Date;
}
