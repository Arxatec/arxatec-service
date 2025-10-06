// src/modules/user/features/edit_profile/presentation/edit_profile.service.ts
import bcrypt from "bcrypt";
import { AppError } from "../../../../../utils";
import { HttpStatusCodes } from "../../../../../constants";
import type {
  EditProfileRequest,
  EditProfileResponse,
} from "../domain/edit_profile.payload";
import { updateProfile, getUserStatus } from "../data/edit_profile.repository";
import { CurrentUser } from "../../../../../utils/authenticated_user";

export async function editProfileService(
  dto: EditProfileRequest,
  user: CurrentUser
): Promise<EditProfileResponse> {
  if (user.role === "client") {
    const dbUser = await getUserStatus(user.id);
    if (dbUser.status !== "active") {
      throw new AppError(
        "Inactive users cannot edit profile",
        HttpStatusCodes.FORBIDDEN.code
      );
    }
  }

  const root: Record<string, unknown> = {};
  const details: { gender?: string; birth_date?: Date } = {};

  if (dto.firstName) root.first_name = dto.firstName;
  if (dto.lastName) root.last_name = dto.lastName;
  if (dto.phone) root.phone = dto.phone;

  if (dto.birthDate) details.birth_date = dto.birthDate;
  if (dto.gender) details.gender = dto.gender;

  if (dto.password) {
    root.password = await bcrypt.hash(dto.password, 10);
  }

  const updated = await updateProfile(user.id, root, details);

  return {
    id: updated.id,
    first_name: updated.first_name,
    last_name: updated.last_name,
    email: updated.email,
    user_type: updated.user_type,
    user_details: {
      gender: updated.user_details?.gender ?? "unspecified",
      birth_date: updated.user_details?.birth_date ?? null,
    },
    admin_details: updated.admin_details
      ? { notes: updated.admin_details.notes ?? null }
      : null,
  };
}
