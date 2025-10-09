// src/modules/case/features/messages/domain/message.payload.ts
import { z } from "zod";
import { SendMessageSchema } from "./send_message.schema";

export type SendMessageRequest = z.infer<typeof SendMessageSchema>;

export type MessageItem = {
  id: string;
  content: string;
  sent_by: "client" | "lawyer";
  is_read: boolean;
  created_at: Date;
  sent_name: string;
};

export type SendMessageResponse = {
  message: string;
  data: { message: MessageItem };
};

export type GetHistoryResponse = {
  message: string;
  data: {
    messages: MessageItem[];
  };
};

export type CurrentUser = {
  id: string;
  user_type: "client" | "lawyer";
};
