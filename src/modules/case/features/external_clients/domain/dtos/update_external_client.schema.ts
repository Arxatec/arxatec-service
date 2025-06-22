// update_external_client.schema.ts
import { z } from "zod";

export const UpdateExternalClientSchema = z.object({
  full_name: z
    .string({ invalid_type_error: "FULL_NAME_INVALID" })
    .min(2, "FULL_NAME_TOO_SHORT")
    .max(120, "FULL_NAME_TOO_LONG")
    .optional(),
  phone: z
    .string({ invalid_type_error: "PHONE_INVALID" })
    .min(7, "PHONE_TOO_SHORT")
    .max(15, "PHONE_TOO_LONG")
    .optional(),
  dni: z.string({ invalid_type_error: "DNI_INVALID" }).length(8, "DNI_MUST_BE_8_DIGITS").optional(),
  email: z.string({ invalid_type_error: "EMAIL_INVALID_FORMAT" }).email("EMAIL_INVALID_FORMAT").optional(),
});

export type UpdateExternalClientDTO = z.infer<
  typeof UpdateExternalClientSchema
>;
