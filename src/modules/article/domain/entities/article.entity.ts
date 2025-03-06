export interface Article {
  id: number;
  userId: number;
  title: string;
  content: string;
  banner?: string; 
  categoryId: number;
  publicationDate: Date;
  publicationTime: Date;
  status: "pending" | "accepted" | "rejected";
}
