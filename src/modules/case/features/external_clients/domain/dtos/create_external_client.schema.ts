// create_external_client.schema.ts
import { z } from "zod";

export const CreateExternalClientSchema = z.object({
  full_name: z
    .string({ required_error: "FULL_NAME_REQUIRED" })
    .min(2, "FULL_NAME_TOO_SHORT")
    .max(120, "FULL_NAME_TOO_LONG"),
  phone: z
    .string({ required_error: "PHONE_REQUIRED" })
    .min(7, "PHONE_TOO_SHORT")
    .max(15, "PHONE_TOO_LONG"),
  dni: z
    .string({ required_error: "DNI_REQUIRED" })
    .length(8, "DNI_MUST_BE_8_DIGITS"),
  email: z
    .string({ invalid_type_error: "EMAIL_INVALID_FORMAT" })
    .email("EMAIL_INVALID_FORMAT")
    .optional(),
});

export type CreateExternalClientDTO = z.infer<
  typeof CreateExternalClientSchema
>;
