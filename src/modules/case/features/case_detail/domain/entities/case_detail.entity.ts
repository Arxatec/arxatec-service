export interface CaseDetailEntity {
  id: number;
  title: string;
  description: string | null;
  category: { id: number; name: string };
  status: { id: number; name: string };
  urgency: string;
  is_public: boolean;
  created_at: Date;
  service: {
    id: number;
    lawyer_id: number | null;
    client_id: number | null;
    external_client_id: number | null;
  };
  attachments: {
    id: number;
    label: string;
    category_id: number;
    uploaded_by: "client" | "lawyer";
    created_at: Date;
  }[];
  histories: {
    id: number;
    field: string;
    old_value: string;
    new_value: string;
    created_at: Date;
  }[];
}
