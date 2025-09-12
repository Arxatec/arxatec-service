//src/modules/auth/features/login/login_with_google/domain/login_with_google.schema.ts
import { z } from "zod";

export const LoginGoogleSchema = z.object({
  googleToken: z
    .string({
      required_error: "Google token is required",
    })
    .trim(),
});
