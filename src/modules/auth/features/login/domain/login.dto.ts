import { z } from "zod";
import { LoginSchema } from "./login.schema";

export type LoginDTO = z.infer<typeof LoginSchema>;

export interface LoginResponseDTO {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  token: string;
}
