// src/modules/case/features/associations/external_clients/get_detail/presentation/get_detail.service.ts
import { findExternalClientByIdAndLawyer } from "../data/get_detail.repository";
import { AppError } from "../../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../../constants/http_status_codes";
import type { ExternalClientDetailResponse } from "../domain/get_detail.payload";

export async function getExternalClientDetailService(
  id: string,
  userDetailId: string
): Promise<ExternalClientDetailResponse> {
  const client = await findExternalClientByIdAndLawyer(id, userDetailId);
  if (!client)
    throw new AppError("Cliente externo no encontrado", HttpStatusCodes.NOT_FOUND.code);

  return {
    id: client.id,
    profile_image: client.profile_image,
    full_name: client.full_name,
    email: client.email,
    phone: client.phone,
    dni: client.dni,
    created_at: client.created_at,
    archived: client.archived,
  };
}
