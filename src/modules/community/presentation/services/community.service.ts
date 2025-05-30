import { CommunityRepository } from "../../data/repository/community.repository";
import { CreateCommunityDTO } from "../../domain/dtos/create_community.dto";
import { UpdateCommunityDTO } from "../../domain/dtos/update_community.dto";
import { Community } from "../../domain/entities/community.entity";
import { MESSAGES } from "../../../../constants/messages";

export class CommunityService {
  constructor(private repository: CommunityRepository) {}

  async createCommunity(userId: number, data: CreateCommunityDTO): Promise<Community> {
    return this.repository.createCommunity(userId, data);
  }

  async getAllCommunities(): Promise<Community[]> {
    return this.repository.getAllCommunities();
  }

  async getCommunityById(id: number): Promise<Community> {
    const c = await this.repository.getCommunityById(id);
    if (!c) throw new Error(MESSAGES.COMMUNITY.COMMUNITY_ERROR_NOT_FOUND);
    return c;
  }

  async updateCommunity(id: number, userId: number, data: UpdateCommunityDTO): Promise<Community> {
    return this.repository.updateCommunity(id, userId, data);
  }

  async deleteCommunity(id: number, userId: number): Promise<void> {
    return this.repository.deleteCommunity(id, userId);
  }

  async joinCommunity(communityId: number, userId: number): Promise<void> {
    return this.repository.joinCommunity(communityId, userId);
  }
}
