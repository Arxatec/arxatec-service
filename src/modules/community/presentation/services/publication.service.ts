import { PublicationRepository } from "../../data/repository/publication.repository";
import { CreatePublicationDTO } from "../../domain/dtos/create_publication.dto";
import { UpdatePublicationDTO } from "../../domain/dtos/update_publication.dto";
import { Publication } from "../../domain/entities/publication.entity";
import { MESSAGES } from "../../../../constants/messages";

export class PublicationService {
  constructor(private repo: PublicationRepository) {}

  async create(communityId: number, data: CreatePublicationDTO, userId: number): Promise<Publication> {
    return this.repo.create(communityId, data, userId);
  }

  async getByCommunityId(communityId: number): Promise<Publication[]> {
    return this.repo.getByCommunityId(communityId);
  }

  async getById(id: number): Promise<Publication> {
    const pub = await this.repo.getById(id);
    if (!pub) throw new Error(MESSAGES.COMMUNITY.PUBLICATION_ERROR_NOT_FOUND);
    return pub;
  }

  async update(id: number, userId: number, data: UpdatePublicationDTO): Promise<Publication> {
    return this.repo.update(id, userId, data);
  }

  async delete(id: number, userId: number): Promise<void> {
    return this.repo.delete(id, userId);
  }
}
