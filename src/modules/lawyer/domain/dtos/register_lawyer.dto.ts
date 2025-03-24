import { z } from "zod";
import { MESSAGES } from "../../../../constants/messages";

export const RegisterLawyerSchema = z.object({
  id: z.number(),
  license_number: z.string({ required_error: MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_LICENSE_NUMBER })
                   .min(1, MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_LICENSE_NUMBER),
  gender: z.string({ required_error: MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_GENDER })
           .min(1, MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_GENDER),
  birth_date: z.string({ required_error: MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_BIRTH_DATE })
              .min(1, MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_BIRTH_DATE),
  specialty: z.string({ required_error: MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_SPECIALTY })
             .min(1, MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_SPECIALTY).optional(),
  experience: z.number().optional(),
  biography: z.string({ required_error: MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_BIOGRAPHY })
             .min(1, MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_BIOGRAPHY).optional(),
  linkedin: z.string({ required_error: MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_LINKEDIN })
            .min(1, MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_LINKEDIN).optional(),
  preferred_client: z.string({ required_error: MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_PREFERRED_CLIENT })
                      .min(1, MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_PREFERRED_CLIENT).optional(),
  payment_methods: z.string({ required_error: MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_PAYMENT_METHODS })
                     .min(1, MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_PAYMENT_METHODS).optional(),
  currency: z.string({ required_error: MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_CURRENCY })
            .min(1, MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_CURRENCY).optional(),
  attorneyFees: z.array(
    z.object({
      service_category_id: z.number(),
      fee: z.number()
    })
  ).optional(),
  workSchedules: z.array(
    z.object({
      day: z.string({ required_error: MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_DAY })
           .min(1, MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_DAY),
      open_time: z.string({ required_error: MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_OPEN_TIME })
                 .min(1, MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_OPEN_TIME),
      close_time: z.string({ required_error: MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_CLOSE_TIME })
                  .min(1, MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_CLOSE_TIME)
    })
  ).optional()
}).strict();

export type RegisterLawyerDTO = z.infer<typeof RegisterLawyerSchema>;
