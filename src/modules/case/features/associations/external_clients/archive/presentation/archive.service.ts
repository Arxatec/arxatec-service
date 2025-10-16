// src/modules/case/features/associations/external_clients/archive/presentation/archive.service.ts
import { AppError } from "../../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../../constants/http_status_codes";
import {
  findByIdAndLawyer,
  archiveExternalClient,
} from "../data/archive.repository";

export async function archiveExternalClientService(
  id: string,
  userDetailId: string
) {
  const client = await findByIdAndLawyer(id, userDetailId, false);
  if (!client)
    throw new AppError(
      "Cliente externo no encontrado",
      HttpStatusCodes.NOT_FOUND.code
    );
  await archiveExternalClient(id);
  return { id, message: "Cliente externo archived exitosamente" };
}
