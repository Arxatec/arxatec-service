// src/modules/cases/features/associations/attachments/create/domain/create.payload.ts
import z from "zod";
import { CreateAttachmentSchema } from "./create.schema";

export type CreateAttachmentRequest = z.infer<typeof CreateAttachmentSchema>;
export interface CreateAttachmentResponse {
  attachment: { id: string; url: string };
  user: { id: string | number; role: "client" | "lawyer" };
}
