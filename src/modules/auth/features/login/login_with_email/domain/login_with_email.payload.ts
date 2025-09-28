import { z } from "zod";
import { LoginSchema } from "./login_with_email.schema";

export type LoginRequest = z.infer<typeof LoginSchema>;

export interface LoginResponse {
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
