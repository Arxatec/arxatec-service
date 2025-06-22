import { z } from "zod";
import { SendMessageSchema } from "./send_message.schema";

export type SendMessageDTO = z.infer<typeof SendMessageSchema>;

export interface MessageEntity {
  id: number;
  content: string;
  sent_by: "client" | "lawyer";
  is_read: boolean;
  created_at: Date;
}