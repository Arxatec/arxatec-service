// src/modules/auth/features/login/login_with_facebook/domain/login_with_facebook.dto.ts
import { z } from "zod";
import { LoginFacebookSchema } from "./login_with_facebook.schema";

export type LoginFacebookDTO = z.infer<typeof LoginFacebookSchema>;

export interface LoginFacebookResponseDTO {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  token: string;
  isNewUser: boolean;
}
