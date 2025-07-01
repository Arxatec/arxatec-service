import { ExternalClientsRepository } from "../../data/external_clients.repository";
import { CreateExternalClientDTO } from "../../domain/dtos/create_external_client.dto";
import { UpdateExternalClientDTO } from "../../domain/dtos/update_external_client.dto";
import { uploadFile, deleteFile } from "../../../../../../infrastructure/aws";
import { AppError } from "../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { MESSAGES } from "../../../../../../constants/messages";

export class ExternalClientsService {
  constructor(private repo = new ExternalClientsRepository()) {}

  /* ───────────── CREATE ───────────── */
  async createExternalClient(
    dto: CreateExternalClientDTO,
    avatarFile: Express.Multer.File | undefined,
    userDetailId: number
  ) {
    try {
      let avatarUrl: string | undefined;

      if (avatarFile) {
        const { url } = await uploadFile(
          avatarFile,
          "public/external_clients/avatars"
        );
        avatarUrl = url;
      }

      const created = await this.repo.create({
        full_name: dto.full_name,
        phone: dto.phone,
        dni: dto.dni,
        email: dto.email ?? "",
        profile_image: avatarUrl,
        user_detail: { connect: { user_id: userDetailId } },
      });

      return {
        id: created.id,
        message: MESSAGES.CASE.EXTERNAL_CLIENT_CREATED,
      };
    } catch (error) {
      console.log(error);
    }
  }

  /* ───────────── LIST (active) ───────────── */
  listExternalClients(userDetailId: number) {
    return this.repo.findManyByLawyer(userDetailId, false);
  }

  /* ───────────── UPDATE ───────────── */
  async updateExternalClient(
    id: number,
    dto: UpdateExternalClientDTO,
    avatarFile: Express.Multer.File | undefined,
    userDetailId: number
  ) {
    const client = await this.repo.findByIdAndLawyer(id, userDetailId, false);
    if (!client) {
      throw new AppError(
        MESSAGES.CASE.EXTERNAL_CLIENT_NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );
    }

    let avatarUrl = client.profile_image;

    if (avatarFile) {
      if (avatarUrl) {
        const oldKey = avatarUrl.split(".amazonaws.com/")[1];
        if (oldKey) await deleteFile(oldKey);
      }
      const { url } = await uploadFile(
        avatarFile,
        "public/external_clients/avatars"
      );
      avatarUrl = url;
    }

    await this.repo.update(id, {
      full_name: dto.full_name,
      phone: dto.phone,
      dni: dto.dni,
      email: dto.email,
      profile_image: avatarUrl,
    });

    return {
      id,
      message: MESSAGES.CASE.EXTERNAL_CLIENT_UPDATED,
    };
  }
  /* ───────────── ARCHIVE ───────────── */
  async archiveExternalClient(id: number, userDetailId: number) {
    const client = await this.repo.findByIdAndLawyer(id, userDetailId, false);
    if (!client) {
      throw new AppError(
        MESSAGES.CASE.EXTERNAL_CLIENT_NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );
    }
    await this.repo.archive(id);
    return { id, message: MESSAGES.CASE.EXTERNAL_CLIENT_ARCHIVED };
  }

  /* ───────────── LIST ARCHIVED ───────────── */
  listArchivedExternalClients(userDetailId: number) {
    return this.repo.findManyByLawyer(userDetailId, true);
  }

  /* ───────────── RESTORE ───────────── */
  async restoreExternalClient(id: number, userDetailId: number) {
    const client = await this.repo.findByIdAndLawyer(id, userDetailId, true);
    if (!client) {
      throw new AppError(
        MESSAGES.CASE.EXTERNAL_CLIENT_NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );
    }
    await this.repo.restore(id);
    return { id, message: MESSAGES.CASE.EXTERNAL_CLIENT_RESTORED };
  }
}
