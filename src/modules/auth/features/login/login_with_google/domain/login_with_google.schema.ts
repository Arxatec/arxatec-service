import { z } from "zod";

export const LoginGoogleSchema = z.object({
  googleToken: z
    .string({
      required_error: "Google token is required",
    })
    .trim(),
});
