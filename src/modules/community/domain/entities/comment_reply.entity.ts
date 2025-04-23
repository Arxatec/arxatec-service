export interface CommentReply {
  id: number;
  reply: string;
  comment_id: number;
  community_user_id: number;
  created_at: Date;
}
