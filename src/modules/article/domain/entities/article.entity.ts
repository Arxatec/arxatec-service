export interface Article {
  id: number;
  userId: number;
  title: string;
  content: string;
  banner: string;
  categoryId: number;
  publication_timestamp: Date;
  status: "pending" | "accepted" | "rejected";
}
