// src/modules/case/features/associations/external_clients/create/domain/create.schema.ts
import { z } from "zod";

export const CreateExternalClientSchema = z.object({
  full_name: z
    .string()
    .min(2, "FULL_NAME_TOO_SHORT")
    .max(120, "FULL_NAME_TOO_LONG"),
  phone: z.string().min(7, "PHONE_TOO_SHORT").max(15, "PHONE_TOO_LONG"),
  dni: z.string().length(8, "DNI_MUST_BE_8_DIGITS"),
  email: z.string().email("EMAIL_INVALID_FORMAT").optional(),
});

export type CreateExternalClientDTO = z.infer<
  typeof CreateExternalClientSchema
>;
