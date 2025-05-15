import { z } from "zod";
import { LoginSchema } from "./login_with_email.schema";

export type LoginDTO = z.infer<typeof LoginSchema>;

export interface LoginResponseDTO {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string | null;
  };
  token: string;
}
