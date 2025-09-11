// src/modules/auth/features/registration/request_reqistration/domain/request_registration.dto.ts
import { z } from "zod";
import { RequestRegistrationSchema } from "./request_registration.schema";

export type RequestRegistrationDTO = z.infer<typeof RequestRegistrationSchema>;

export interface RequestRegistrationResponseDTO {
  message: string;
}
