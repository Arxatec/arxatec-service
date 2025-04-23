import { z } from "zod";
import { AUTH_MESSAGES } from "../../../../../../constants/messages/auth";

export const RequestRegistrationSchema = z
  .object({
    first_name: z
      .string({
        required_error: AUTH_MESSAGES.REQUEST_REGISTRATION.ERROR_REQUIRED_NAME,
      })
      .min(2, AUTH_MESSAGES.REQUEST_REGISTRATION.ERROR_INVALID_NAME_MIN_LENGTH)
      .trim(),
    last_name: z
      .string({
        required_error:
          AUTH_MESSAGES.REQUEST_REGISTRATION.ERROR_REQUIRED_LAST_NAME,
      })
      .min(
        2,
        AUTH_MESSAGES.REQUEST_REGISTRATION.ERROR_INVALID_LAST_NAME_MIN_LENGTH
      )
      .trim(),
    email: z
      .string({
        required_error: AUTH_MESSAGES.REQUEST_REGISTRATION.ERROR_REQUIRED_EMAIL,
      })
      .email({
        message: AUTH_MESSAGES.REQUEST_REGISTRATION.ERROR_INVALID_EMAIL,
      })
      .trim(),
    password: z
      .string({
        required_error:
          AUTH_MESSAGES.REQUEST_REGISTRATION.ERROR_REQUIRED_PASSWORD,
      })
      .min(
        6,
        AUTH_MESSAGES.REQUEST_REGISTRATION.ERROR_REQUIRED_PASSWORD_MIN_LENGTH
      )
      .trim(),
    confirm_password: z
      .string({
        required_error:
          AUTH_MESSAGES.REQUEST_REGISTRATION.ERROR_REQUIRED_CONFIRM_PASSWORD,
      })
      .min(
        6,
        AUTH_MESSAGES.REQUEST_REGISTRATION
          .ERROR_REQUIRED_CONFIRM_PASSWORD_MIN_LENGTH
      )
      .trim(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: AUTH_MESSAGES.REQUEST_REGISTRATION.ERROR_PASSWORD_NOT_MATCH,
    path: ["confirm_password"],
  });
