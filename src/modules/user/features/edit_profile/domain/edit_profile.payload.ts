import z from "zod";
import { EditProfileSchema } from "./edit_profile.schema";

export type EditProfileRequest = z.infer<typeof EditProfileSchema>;

export interface EditProfileResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  user_details: { gender: string; birth_date: Date | null };
  admin_details: { notes: string | null } | null;
}
