// src/constants/messages/auth/index.ts

export const AUTH_MESSAGES = {
  // Registro de usuario
  EMAIL_IN_USE: "The email is already in use.",
  EMAIL_IN_USE_VERIFIED: "This email is already registered and verified.",
  EMAIL_IN_USE_PENDING_RESENT: "This email is registered but not yet verified. A new verification code has been sent.",
  EMAIL_IN_USE_PENDING_ACTIVE_TOKEN: "This email is registered but not yet verified. Your existing verification token is still valid.",
  USER_REGISTERED_SUCCESS: "User registered successfully. A verification code was sent to your email.",
  CODE_GENERATION_FAILED: "Failed to generate verification code.",

  // Verificación de código
  INVALID_VERIFICATION_CODE: "Invalid or expired verification code.",
  USER_VERIFIED: "User verified successfully.",

  // Inicio de sesión
  INVALID_CREDENTIALS: "Invalid credentials.",
  USER_NOT_VERIFIED: "User is not verified.",
  LOGIN_SUCCESS: "Login successful.",

  // Recuperación de contraseña
  USER_NOT_FOUND: "User not found.",
  PASSWORD_RESET_CODE_SENT: "A password reset code was sent to your email.",
  INVALID_RESET_CODE: "Invalid or expired reset code.",
  PASSWORD_RESET_SUCCESS: "Password reset successfully.",
  PASSWORD_RESET_ALREADY_REQUESTED: "A password reset has already been requested recently. Please check your email.",
  PASSWORD_RESET_EMAIL_FAILED: "Unable to send the password reset email. Try again later.",


  // Errores generales
  UNAUTHORIZED: "Unauthorized access.",
};
