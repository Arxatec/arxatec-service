// src/modules/auth/features/login/login_with_email/domain/login_with_email.dto.ts
import { z } from "zod";
import { LoginSchema } from "./login_with_email.schema";

export type LoginDTO = z.infer<typeof LoginSchema>;

export interface LoginResponseDTO {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    userType: "admin" | "client" | "lawyer" | null;
    role?: string | null;
  };
  token: string;
}
