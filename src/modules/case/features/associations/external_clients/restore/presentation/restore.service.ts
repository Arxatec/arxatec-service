// src/modules/case/features/associations/external_clients/restore/presentation/restore.service.ts
import { AppError } from "../../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../../constants/http_status_codes";
import {
  findByIdAndLawyer,
  restoreExternalClient,
} from "../data/restore.repository";
import type { RestoreExternalClientResponse } from "../domain/restore.payload";

export async function restoreExternalClientService(
  id: string,
  userDetailId: string
): Promise<RestoreExternalClientResponse> {
  const client = await findByIdAndLawyer(id, userDetailId);
  if (!client) {
    throw new AppError(
      "Cliente externo no encontrado",
      HttpStatusCodes.NOT_FOUND.code
    );
  }

  if (client.archived) {
    await restoreExternalClient(id);
  }

  return { id, message: "Cliente externo restaurado correctamente" };
}
