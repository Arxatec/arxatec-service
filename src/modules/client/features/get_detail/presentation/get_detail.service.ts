// src/modules/client/features/get_detail/presentation/get_detail.service.ts

import { findClientById } from "../data/get_detail.repository";
import { AppError } from "../../../../../utils";
import { HttpStatusCodes } from "../../../../../constants";

export async function getDetailService(id: string) {
  const client = await findClientById(id);
  if (!client) {
    throw new AppError("Cliente no encontrado", HttpStatusCodes.NOT_FOUND.code);
  }

  return {
    id: client.id,
    profile_image: client.profile_image,
    full_name: client.first_name + " " + client.last_name,
    email: client.email,
    phone: client.phone,
    created_at: client.creation_timestamp,
  };
}
