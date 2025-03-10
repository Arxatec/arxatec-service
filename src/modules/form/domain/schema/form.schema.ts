import { z } from "zod";
import { MESSAGES } from "../../../../constants";

export const SupportFormSchema = z
  .object({
    first_name: z
      .string({
        required_error: MESSAGES.FORM.SUPPORT_ERROR_REQUIRED_FIRST_NAME,
      })
      .min(1, { message: MESSAGES.FORM.SUPPORT_ERROR_INVALID_FIRST_NAME_MIN_LENGTH })
      .trim(),

    last_name: z
      .string({
        required_error: MESSAGES.FORM.SUPPORT_ERROR_REQUIRED_LAST_NAME,
      })
      .min(1, { message: MESSAGES.FORM.SUPPORT_ERROR_INVALID_LAST_NAME_MIN_LENGTH })
      .trim(),

    email: z
      .string({
        required_error: MESSAGES.FORM.SUPPORT_ERROR_REQUIRED_EMAIL,
      })
      .email({ message: MESSAGES.FORM.SUPPORT_ERROR_INVALID_EMAIL })
      .trim(),

    phone: z
      .string({
        required_error: MESSAGES.FORM.SUPPORT_ERROR_REQUIRED_PHONE,
      })
      .min(7, { message: MESSAGES.FORM.SUPPORT_ERROR_INVALID_PHONE_MIN_LENGTH })
      .regex(/^\+?[0-9\s-]+$/, { message: MESSAGES.FORM.SUPPORT_ERROR_INVALID_PHONE_FORMAT })
      .trim(),

    country: z
      .string({
        required_error: MESSAGES.FORM.SUPPORT_ERROR_REQUIRED_COUNTRY,
      })
      .min(1, { message: MESSAGES.FORM.SUPPORT_ERROR_INVALID_COUNTRY_MIN_LENGTH })
      .trim(),

    subject: z
      .string({
        required_error: MESSAGES.FORM.SUPPORT_ERROR_REQUIRED_SUBJECT,
      })
      .min(1, { message: MESSAGES.FORM.SUPPORT_ERROR_INVALID_SUBJECT_MIN_LENGTH })
      .trim(),

    message: z
      .string({
        required_error: MESSAGES.FORM.SUPPORT_ERROR_REQUIRED_MESSAGE,
      })
      .min(1, { message: MESSAGES.FORM.SUPPORT_ERROR_INVALID_MESSAGE_MIN_LENGTH })
      .trim(),
  })
  .strict();
