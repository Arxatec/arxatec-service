import { z } from "zod";
import { MESSAGES } from "../../../../constants/messages";

export const RegisterClientSchema = z.object({
  id: z.number(),
  budget_range: z.string({ required_error: MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_BUDGET_RANGE })
                 .min(1, MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_BUDGET_RANGE)
                 .optional(),
  urgency_level: z.string({ required_error: MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_URGENCY_LEVEL })
                  .min(1, MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_URGENCY_LEVEL)
                  .optional(),
  requirement_type: z.string({ required_error: MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_REQUIREMENT_TYPE })
                    .min(1, MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_REQUIREMENT_TYPE)
                    .optional(),
  profile_image: z.string({ required_error: MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_PROFILE_IMAGE })
                 .min(1, MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_PROFILE_IMAGE)
                 .optional(),
  birth_date: z.string({ required_error: MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_BIRTH_DATE })
              .min(1, MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_BIRTH_DATE)
              .optional(),
  gender: z.string({ required_error: MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_GENDER })
          .min(1, MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_GENDER)
          .optional(),
  communication_channel: z.string({ required_error: MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_COMMUNICATION_CHANNEL })
                         .min(1, MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_COMMUNICATION_CHANNEL)
                         .optional(),
  receive_notifications: z.boolean().optional(),
  notification_channels: z.string({ required_error: MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_NOTIFICATION_CHANNELS })
                          .min(1, MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_NOTIFICATION_CHANNELS)
                          .optional(),
  country: z.string({ required_error: MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_COUNTRY })
           .min(1, MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_COUNTRY)
           .optional(),
  state: z.string({ required_error: MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_STATE })
          .min(1, MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_STATE)
          .optional(),
  city: z.string({ required_error: MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_CITY })
         .min(1, MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_CITY)
         .optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  full_address: z.string({ required_error: MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_FULL_ADDRESS })
                .min(1, MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_FULL_ADDRESS)
                .optional(),
  postal_code: z.string({ required_error: MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_POSTAL_CODE })
               .min(1, MESSAGES.CLIENT.CLIENT_ERROR_REQUIRED_POSTAL_CODE)
               .optional()
}).strict();

export type RegisterClientDTO = z.infer<typeof RegisterClientSchema>;
