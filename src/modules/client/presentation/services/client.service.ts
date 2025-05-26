import { ClientRepository } from "../../data/repository/client.repository";
import { UpdateClientDTO } from "../../domain/dtos/update_client.dto";
import { RegisterClientDTO } from "../../domain/dtos/register_client.dto";
import { Client } from "../../domain/entities/client.entity";
import { MESSAGES } from "../../../../constants/messages";
import { Pagination } from "../../../../utils/pagination";

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
      this.clientRepository.countClients()
    ]);
    return {
      data,
      meta: Pagination.buildPaginationMeta(total, page, limit)
    };
  }

  async getClientProfile(userId: number): Promise<Client> {
    const client = await this.clientRepository.getById(userId);
    if (!client) throw new Error(MESSAGES.CLIENT.CLIENT_ERROR_NOT_FOUND);
    return client;
  }

  async updateClientProfile(userId: number, data: UpdateClientDTO): Promise<Client> {
    return this.clientRepository.updateClientProfile(userId, data);
  }

  async registerClient(data: RegisterClientDTO): Promise<Client> {
    const userId = data.id;
    return this.clientRepository.registerClient(
      userId,
      data.budget_range,
      data.urgency_level,
      data.requirement_type,
      data.profile_image,
      data.birth_date,
      data.gender,
      data.communication_channel,
      data.receive_notifications,
      data.notification_channels,
      data.country,
      data.state,
      data.city,
      data.latitude,
      data.longitude,
      data.full_address,
      data.postal_code
    );
  }
}
