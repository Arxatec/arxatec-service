// src/modules/user/features/get_profile/domain/get_profile.dto.ts
export interface GetProfileResponseDto {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  birth_date: Date | null;
  gender: "male" | "female" | "unspecified";
  user_type: "admin" | "client" | "lawyer";
  status: "active" | "suspended" | "pending";
  admin_details: { notes: string | null } | null;
}
