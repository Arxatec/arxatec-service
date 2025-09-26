// src/modules/case/features/associations/external_clients/create/presentation/create.service.ts
import { uploadFile } from "../../../../../../../infrastructure/aws";
import { CreateExternalClientRepository } from "../data/create.repository";
import { CreateExternalClientDTO } from "../domain/create.dto";

export class CreateExternalClientService {
  constructor(private readonly repo = new CreateExternalClientRepository()) {}

  async createExternalClient(
    dto: CreateExternalClientDTO,
    avatar: Express.Multer.File | undefined,
    userDetailId: string
  ) {
    let profile_image: string | undefined;

    if (avatar) {
      const { url } = await uploadFile(
        avatar,
        "public/external_clients/avatars"
      );
      profile_image = url;
    }

    const created = await this.repo.create({
      full_name: dto.full_name,
      phone: dto.phone,
      dni: dto.dni,
      email: dto.email ?? "",
      profile_image,
      user_detail: { connect: { user_id: userDetailId } },
    });

    return { id: created.id, message: "EXTERNAL_CLIENT_CREATED" };
  }
}
