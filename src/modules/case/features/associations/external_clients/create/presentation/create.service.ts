// src/modules/case/features/associations/external_clients/create/presentation/create.service.ts
import type { Express } from "express";
import { uploadS3File } from "../../../../shared/s3_file/s3_file.service";
import { createExternalClientRepo } from "../data/create.repository";
import type {
  CreateExternalClientRequest,
  CreateExternalClientResponse,
} from "../domain/create.payload";

export async function createExternalClientService(
  dto: CreateExternalClientRequest,
  avatar: Express.Multer.File | undefined,
  userDetailId: string
): Promise<CreateExternalClientResponse> {
  let profile_image: string | undefined;

  if (avatar) {
    const uploaded = await uploadS3File(
      avatar,
      "public/external_clients/avatars"
    );
    profile_image = (uploaded as any)?.url;
  }

  const created = await createExternalClientRepo({
    full_name: dto.full_name,
    phone: dto.phone,
    dni: dto.dni,
    email: dto.email,
    profile_image,
    userDetailId,
  });

  return { id: created.id, message: "Cliente externo creado exitosamente" };
}
