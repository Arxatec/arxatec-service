import { AppError } from "../../../../../utils";
import { HttpStatusCodes } from "../../../../../constants";
import {
  findLawyerById,
  updateLawyerProfile,
} from "../data/update_profile.repository";
import {
  UpdateLawyerProfileRequest,
  UpdateLawyerProfileResponse,
} from "../domain/update_profile.payload";

export async function updateLawyerProfileService(
  id: string,
  data: UpdateLawyerProfileRequest
): Promise<UpdateLawyerProfileResponse> {
  const exists = await findLawyerById(id);
  if (!exists) {
    throw new AppError(
      "Abogado no encontrado o no válido",
      HttpStatusCodes.NOT_FOUND.code
    );
  }

  const updated = await updateLawyerProfile(id, data);
  return updated;
}
