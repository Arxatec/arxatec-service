import { z } from "zod";
import { MESSAGES } from "../../../../constants/messages";

export const RegisterClientSchema = z
  .object({
    id: z.number(),
    location: z
      .string({
        required_error: MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_LOCATION,
      })
      .min(1, MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_LOCATION),
    occupation: z
      .string({
        required_error: MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_OCCUPATION,
      })
      .min(1, MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_OCCUPATION),
    gender: z.enum(["male", "female"], {
      required_error: MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_GENDER,
    }),
    birth_date: z
      .string({
        required_error: MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_BIRTH_DATE,
      })
      .min(1, MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_BIRTH_DATE),
    budget: z.string({
      required_error: MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_BUDGET,
    }),
    urgency_level: z
      .string({
        required_error: MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_URGENCY_LEVEL,
      })
      .min(1, MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_URGENCY_LEVEL),
    communication_preference: z
      .string({
        required_error:
          MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_COMMUNICATION_PREFERENCE,
      })
      .min(1, MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_COMMUNICATION_PREFERENCE),
    coordinates: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }),
  })
  .strict();

export type RegisterClientDTO = z.infer<typeof RegisterClientSchema>;
