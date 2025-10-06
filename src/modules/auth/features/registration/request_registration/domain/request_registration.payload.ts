//src/modules/auth/features/registration/request_registration/domain/request_registration.payload.ts
import z from "zod";
import { RequestRegistrationSchema } from "./request_registration.schema";

export type RequestRegistrationRequest = z.infer<
  typeof RequestRegistrationSchema
>;

export interface RequestRegistrationResponse {
  message: string;
}
