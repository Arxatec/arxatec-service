import { z } from "zod";
import { MESSAGES } from "../../../../constants/messages";

export const RegisterLawyerSchema = z
  .object({
    id: z.string().transform((val) => Number(val)),
    license_number: z
      .string({
        required_error: MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_LICENSE_NUMBER,
      })
      .min(1, MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_LICENSE_NUMBER),
    gender: z
      .string({ required_error: MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_GENDER })
      .min(1, MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_GENDER),
    birth_date: z
      .string({
        required_error: MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_BIRTH_DATE,
      })
      .min(1, MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_BIRTH_DATE),
    specialty: z
      .string({
        required_error: MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_SPECIALTY,
      })
      .min(1, MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_SPECIALTY)
      .optional(),
    experience: z
      .string()
      .transform((val) => (val ? Number(val) : undefined))
      .optional(),
    biography: z
      .string({
        required_error: MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_BIOGRAPHY,
      })
      .min(1, MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_BIOGRAPHY)
      .optional(),
    linkedin: z
      .string({
        required_error: MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_LINKEDIN,
      })
      .min(1, MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_LINKEDIN)
      .optional(),
    preferred_client: z
      .string({
        required_error: MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_PREFERRED_CLIENT,
      })
      .min(1, MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_PREFERRED_CLIENT)
      .optional(),
    payment_methods: z
      .string({
        required_error: MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_PAYMENT_METHODS,
      })
      .min(1, MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_PAYMENT_METHODS)
      .optional(),
    currency: z
      .string({
        required_error: MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_CURRENCY,
      })
      .min(1, MESSAGES.LAWYER.LAWYER_ERROR_REQUIRED_CURRENCY)
      .optional(),
    communication_preference: z.string().min(1).optional(),
    location: z.string().min(1).optional(),
    coordinates: z.string().transform((val) => {
      if (!val) return undefined;
      const coords = JSON.parse(val);
      return {
        latitude: Number(coords.latitude),
        longitude: Number(coords.longitude),
      };
    }),
    attorneyFees: z
      .string()
      .transform((val) => {
        if (!val) return undefined;
        const fees = JSON.parse(val);
        return fees.map((fee: any) => ({
          service_category_id: Number(fee.service_category_id),
          fee: Number(fee.fee),
        }));
      })
      .optional(),
    workSchedules: z
      .string()
      .transform((val) => {
        if (!val) return undefined;
        const schedules = JSON.parse(val);
        return schedules.map((schedule: any) => ({
          day: schedule.day,
          open_time: schedule.open_time,
          close_time: schedule.close_time,
        }));
      })
      .optional(),
  })
  .strict();

export type RegisterLawyerDTO = z.infer<typeof RegisterLawyerSchema>;
