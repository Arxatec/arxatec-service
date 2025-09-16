// src/modules/case/features/associations/external_clients/get_detail/presentation/get_detail.service.ts
import { getExternalClientDetailRepository as repo } from "../data/get_detail.repository";
import { AppError } from "../../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../../constants/http_status_codes";

export const getExternalClientDetailService = async (
  id: string,
  userDetailId: string
) => {
  const client = await repo.findByIdAndLawyer(id, userDetailId);
  if (!client)
    throw new AppError(
      "EXTERNAL_CLIENT_NOT_FOUND",
      HttpStatusCodes.NOT_FOUND.code
    );
  return client;
};
