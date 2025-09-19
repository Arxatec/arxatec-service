// src/modules/case/features/associations/external_clients/archive/presentation/archive.service.ts
import { archiveExternalClientRepository as repo } from "../data/archive.repository";
import { AppError } from "../../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../../constants/http_status_codes";

export const archiveExternalClientService = async (
  id: string,
  userDetailId: string
) => {
  const client = await repo.findByIdAndLawyer(id, userDetailId, false);
  if (!client)
    throw new AppError(
      "Cliente externo no encontrado",
      HttpStatusCodes.NOT_FOUND.code
    );
  await repo.archive(id);
  return { id, message: "Cliente externo archivado exitosamente" };
};
