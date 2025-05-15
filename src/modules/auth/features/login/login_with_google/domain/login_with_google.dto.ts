import { z } from "zod";
import { LoginGoogleSchema } from "./login_with_google.schema";

export type LoginGoogleDTO = z.infer<typeof LoginGoogleSchema>;

export interface LoginGoogleResponseDTO {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  token: string;
}
