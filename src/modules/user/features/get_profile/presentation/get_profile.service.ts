// src/modules/user/features/get_profile/presentation/get_profile.service.ts
import { getProfileById } from "../data/get_profile.repository";
import { GetProfileResponse } from "../domain/get_profile.payload";
import { AppError } from "../../../../../utils";
import { HttpStatusCodes } from "../../../../../constants/http_status_codes";

export async function getProfileService(
  userId: string
): Promise<GetProfileResponse> {
  const profile = await getProfileById(userId);

  if (!profile) {
    throw new AppError("El usuario no existe.", HttpStatusCodes.NOT_FOUND.code);
  }

  const gender = (() => {
    const g = String(profile.user_details?.gender ?? "").toUpperCase();
    if (g === "M" || g === "MALE") return "male";
    if (g === "F" || g === "FEMALE") return "female";
    return "unspecified";
  })();

  const userType = (profile.user_type ??
    "client") as GetProfileResponse["user_type"];
  if (!["admin", "client", "lawyer"].includes(userType)) {
    throw new AppError(
      "Tipo de usuario inválido.",
      HttpStatusCodes.BAD_REQUEST.code
    );
  }

  return {
    id: profile.id,
    first_name: profile.first_name,
    last_name: profile.last_name,
    email: profile.email,
    phone: profile.phone ?? null,
    birth_date: profile.user_details?.birth_date ?? null,
    gender,
    user_type: userType,
    status: profile.status as GetProfileResponse["status"],
    admin_details: profile.admin_details
      ? { notes: profile.admin_details.notes ?? null }
      : null,
  };
}
