// src/modules/auth/features/login/login_with_facebook/domain/login_with_facebook.schema.ts
import { z } from "zod";

export const LoginFacebookSchema = z.object({
  facebookToken: z
    .string({ required_error: "Facebook token is required" })
    .trim()
    .min(10, "Facebook token is required"),
});

export type LoginFacebookDTO = z.infer<typeof LoginFacebookSchema>;
