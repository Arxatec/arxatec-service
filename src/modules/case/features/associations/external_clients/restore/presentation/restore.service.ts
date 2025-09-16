// src/modules/case/features/associations/external_clients/restore/presentation/restore.service.ts
import { RestoreExternalClientRepository } from "../data/restore.repository";
import { AppError } from "../../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../../constants/http_status_codes";

export class RestoreExternalClientService {
  constructor(private readonly repo = new RestoreExternalClientRepository()) {}

  async restoreExternalClient(id: string, userDetailId: string) {
    const client = await this.repo.findByIdAndLawyer(id, userDetailId);
    if (!client) {
      throw new AppError(
        "EXTERNAL_CLIENT_NOT_FOUND",
        HttpStatusCodes.NOT_FOUND.code
      );
    }

    if (client.archived) {
      await this.repo.restore(id);
    }

    return { id, message: "EXTERNAL_CLIENT_RESTORED" };
  }
}
