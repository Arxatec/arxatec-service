export interface Article {
  id: number;
  userId: number;
  title: string;
  content: string;
  banner: string;
  categoryId: number;
  readingTime: number;
  publicationTimestamp: Date;
  resume?: string | null;
  status: "pending" | "accepted" | "rejected";
}
