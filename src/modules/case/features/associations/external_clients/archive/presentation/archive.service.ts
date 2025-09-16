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
      "EXTERNAL_CLIENT_NOT_FOUND",
      HttpStatusCodes.NOT_FOUND.code
    );
  await repo.archive(id);
  return { id, message: "EXTERNAL_CLIENT_ARCHIVED" };
};
