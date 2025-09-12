// src/modules/auth/features/password_reset/request_password_reset/domain/request_password_reset.dto.ts
import { z } from "zod";
import { RequestPasswordResetSchema } from "./request_password_reset.schema";

export type RequestPasswordResetDTO = z.infer<
  typeof RequestPasswordResetSchema
>;

export interface RequestPasswordResetResponseDTO {
  message: string;
}
