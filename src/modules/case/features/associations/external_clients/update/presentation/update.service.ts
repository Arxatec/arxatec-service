// src/modules/case/features/associations/external_clients/update/presentation/update.service.ts
import {
  uploadFile,
  deleteFile,
} from "../../../../../../../infrastructure/aws";
import { UpdateExternalClientDTO } from "../domain/update.schema";
import { UpdateExternalClientRepository } from "../data/update.repository";
import { AppError } from "../../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../../constants/http_status_codes";

export class UpdateExternalClientService {
  constructor(private readonly repo = new UpdateExternalClientRepository()) {}

  async updateExternalClient(
    id: string,
    dto: UpdateExternalClientDTO,
    avatar: Express.Multer.File | undefined,
    userDetailId: string
  ) {
    const client = await this.repo.findByIdAndLawyer(id, userDetailId, false);
    if (!client) {
      throw new AppError(
        "EXTERNAL_CLIENT_NOT_FOUND",
        HttpStatusCodes.NOT_FOUND.code
      );
    }

    let profile_image = client.profile_image ?? undefined;

    if (avatar) {
      if (profile_image) {
        const oldKey = profile_image.split(".amazonaws.com/")[1];
        if (oldKey) await deleteFile(oldKey);
      }
      const { url } = await uploadFile(
        avatar,
        "public/external_clients/avatars"
      );
      profile_image = url;
    }

    await this.repo.update(id, {
      full_name: dto.full_name,
      phone: dto.phone,
      dni: dto.dni,
      email: dto.email,
      profile_image,
    });

    return { id, message: "EXTERNAL_CLIENT_UPDATED" };
  }
}
