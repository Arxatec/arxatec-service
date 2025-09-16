// src/modules/user/features/get_profile/presentation/get_profile.service.ts
import { CurrentUser } from "../../../../../utils/authenticated_user";
import { GetProfileRepository } from "../data/get_profile.repository";
import { GetProfileResponseDto } from "../domain/get_profile.dto";

export class GetProfileService {
  constructor(private readonly repo = new GetProfileRepository()) {}

  async execute(user: CurrentUser): Promise<GetProfileResponseDto> {
    const profile = await this.repo.getProfile(user.id);

    const parsedGender: "male" | "female" | "unspecified" = (() => {
      const g = String(profile.user_details?.gender ?? "").toUpperCase();
      if (g === "M" || g === "MALE") return "male";
      if (g === "F" || g === "FEMALE") return "female";
      return "unspecified";
    })();

    const userType = profile.user_type ?? "client";
    if (!["admin", "client", "lawyer"].includes(userType))
      throw new Error("INVALID_USER_TYPE");

    return {
      id: profile.id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      email: profile.email,
      phone: profile.phone ?? null,
      birth_date: profile.user_details?.birth_date ?? null,
      gender: parsedGender,
      user_type: userType as "admin" | "client" | "lawyer",
      status: profile.status as "active" | "suspended" | "pending",
      admin_details: profile.admin_details
        ? { notes: profile.admin_details.notes ?? null }
        : null,
    };
  }
}
