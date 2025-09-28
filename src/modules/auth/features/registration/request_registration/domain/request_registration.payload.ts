import z from "zod";
import { RequestRegistrationSchema } from "./request_registration.schema";

export type RequestRegistrationRequest = z.infer<
  typeof RequestRegistrationSchema
>;

export interface RequestRegistrationResponse {
  message: string;
}
