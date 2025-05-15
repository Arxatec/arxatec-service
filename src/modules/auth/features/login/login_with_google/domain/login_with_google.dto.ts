import { z } from "zod";
import { LoginGoogleSchema } from "./login_with_google.schema";

export type LoginGoogleDTO = z.infer<typeof LoginGoogleSchema>;

export interface LoginGoogleResponseDTO {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string | null;
  };
  token: string;
  isNewUser: boolean;
}
