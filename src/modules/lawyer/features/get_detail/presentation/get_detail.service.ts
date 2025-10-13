// src/modules/client/features/get_detail/presentation/get_detail.service.ts

import { AppError } from "../../../../../utils";
import { HttpStatusCodes } from "../../../../../constants";
import { findLawyerById } from "../data/get_detail.repository";

export async function getDetailService(id: string) {
  const lawyer = await findLawyerById(id);
  if (!lawyer) {
    throw new AppError("Abogado no encontrado", HttpStatusCodes.NOT_FOUND.code);
  }

  return {
    id: lawyer.id,
    first_name: lawyer.first_name,
    last_name: lawyer.last_name,
    email: lawyer.email,
    phone: lawyer.phone,
    profile_image: lawyer.profile_image,
    lawyer_details: {
      lawyer_id: lawyer.lawyer_details?.lawyer_id,
      license_number: lawyer.lawyer_details?.license_number,
      specialty: lawyer.lawyer_details?.specialty,
      experience: lawyer.lawyer_details?.experience,
      biography: lawyer.lawyer_details?.biography,
      linkedin: lawyer.lawyer_details?.linkedin,
    },
  };
}
