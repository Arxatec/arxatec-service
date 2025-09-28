export const TEMP_CODE_KEY = (email: string) =>
  `TEMPORARY_REGISTRATION_CODE:${email.trim().toLowerCase()}`;
export const TEMP_USER_KEY = (email: string) =>
  `TEMPORARY_USER_REGISTRATION:${email.trim().toLowerCase()}`;
export const TEMP_PASSWORD_RESET_CODE_KEY = (email: string) =>
  `TEMPORARY_PASSWORD_RESET_CODE:${email.trim().toLowerCase()}`;
export const TEMP_PASSWORD_RESET_ATTEMPTS_KEY = (email: string) =>
  `TEMPORARY_PASSWORD_RESET_ATTEMPTS:${email.trim().toLowerCase()}`;
