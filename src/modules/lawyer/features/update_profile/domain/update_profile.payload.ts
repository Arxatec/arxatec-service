import z from "zod";
import { UpdateLawyerProfileSchema } from "./update_profile.schema";

export type UpdateLawyerProfileRequest = z.infer<
  typeof UpdateLawyerProfileSchema
>;

export interface UpdateLawyerProfileResponse {
  id: string;
  phone: string | null;
  profile_image: string | null;
  lawyer_details: unknown;
}
