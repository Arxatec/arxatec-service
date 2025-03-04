export interface Article {
    id: number;
    userId: number;
    title: string;
    content: string;
    publicationDate: Date;
    publicationTime: Date;
    status: "pending" | "accepted" | "rejected";
  }
  