// src/modules/auth/features/login/login_with_google/domain/login_with_google.dto.ts
import { z } from "zod";
import { LoginGoogleSchema } from "./login_with_google.schema";

export type LoginGoogleDTO = z.infer<typeof LoginGoogleSchema>;

export interface LoginGoogleResponseDTO {
  user: {
    id: string;   
    firstName: string;
    lastName: string;
    email: string;
  };
  token: string;  
  isNewUser: boolean;
}
