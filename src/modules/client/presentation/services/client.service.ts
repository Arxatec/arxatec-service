import { ClientRepository } from "../../data/repository/client.repository";
import { UpdateClientDTO } from "../../domain/dtos/update_client.dto";
import { RegisterClientDTO } from "../../domain/dtos/register_client.dto";
import { Client } from "../../domain/entities/client.entity";
import { MESSAGES } from "../../../../constants/messages";
import { Pagination } from "../../../../utils/pagination";
import { uploadFile, deleteFile } from "../../../../infrastructure/aws";

export class ClientService {
  constructor(private clientRepository: ClientRepository) {}

  async getClientById(id: number): Promise<Client> {
    const client = await this.clientRepository.getById(id);
    if (!client) throw new Error(MESSAGES.CLIENT.CLIENT_ERROR_NOT_FOUND);
    return client;
  }

  async getAllClientsPaginated(page: number, limit: number, skip: number) {
    const [data, total] = await Promise.all([
      this.clientRepository.getClientsPaginated(skip, limit),
      this.clientRepository.countClients(),
    ]);
    return {
      data,
      meta: Pagination.buildPaginationMeta(total, page, limit),
    };
  }

  async getClientProfile(userId: number): Promise<Client> {
    const client = await this.clientRepository.getById(userId);
    if (!client) throw new Error(MESSAGES.CLIENT.CLIENT_ERROR_NOT_FOUND);
    return client;
  }

  async updateClientProfile(
    userId: number,
    data: UpdateClientDTO,
    photoFile?: Express.Multer.File
  ): Promise<Client> {
    const client = await this.clientRepository.getById(userId);
    if (!client) throw new Error(MESSAGES.CLIENT.CLIENT_ERROR_NOT_FOUND);

    let photoUrl = data.profile_picture;

    if (photoFile) {
      const photoResponse = await uploadFile(photoFile, "public/users/avatar");
      photoUrl = photoResponse.url;

      // Si existe una foto anterior, la eliminamos
      if (client.profilePicture) {
        const oldPhotoKey = client.profilePicture.split(".amazonaws.com/")[1];
        if (oldPhotoKey) {
          await deleteFile(oldPhotoKey);
        }
      }

      data.profile_picture = photoUrl;
    }

    return this.clientRepository.updateClientProfile(userId, data);
  }

  async registerClient(
    data: RegisterClientDTO,
    photoFile: Express.Multer.File
  ): Promise<Client> {
    try {
      const photoResponse = await uploadFile(photoFile, "public/users/avatar");
      const photoUrl = photoResponse.url;

      const userId = data.id;
      return this.clientRepository.registerClient(
        userId,
        photoUrl,
        data.location,
        data.occupation,
        data.age_range,
        data.gender,
        data.birth_date,
        data.budget,
        data.urgency_level,
        data.communication_preference,
        data.coordinates
      );
    } catch (error) {
      console.log(error);
      throw new Error(MESSAGES.CLIENT.CLIENT_ERROR_REGISTERING);
    }
  }
}
