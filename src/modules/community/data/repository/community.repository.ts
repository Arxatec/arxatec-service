import { PrismaClient } from "@prisma/client";
import { CreateCommunityDTO } from "../../domain/dtos/create_community.dto";
import { UpdateCommunityDTO } from "../../domain/dtos/update_community.dto";
import { Community } from "../../domain/entities/community.entity";
import { MESSAGES } from "../../../../constants/messages";

export class CommunityRepository {
  private prisma = new PrismaClient();

  async createCommunity(userId: number, data: CreateCommunityDTO): Promise<Community> {
    const community = await this.prisma.communities.create({
      data: {
        name: data.name,
        description: data.description,
        banner: data.banner,
        icon: data.icon,
        category_id: data.category_id,
        communityUsers: {
          create: { user_id: userId, type: "moderator" }
        }
      }
    });
    return {
      id: community.id,
      name: community.name,
      description: community.description || "",
      banner: community.banner || "",
      icon: community.icon || "",
      category_id: community.category_id || undefined,
      creator_user_id: userId
    };
  }

  async getAllCommunities(): Promise<Community[]> {
    const communities = await this.prisma.communities.findMany();
    return communities.map(c => ({
      id: c.id,
      name: c.name,
      description: c.description || "",
      banner: c.banner || "",
      icon: c.icon || "",
      category_id: c.category_id || undefined,
      creator_user_id: 0
    }));
  }

  async getCommunityById(id: number): Promise<Community | null> {
    const c = await this.prisma.communities.findUnique({ where: { id } });
    if (!c) return null;
    return {
      id: c.id,
      name: c.name,
      description: c.description || "",
      banner: c.banner || "",
      icon: c.icon || "",
      category_id: c.category_id || undefined,
      creator_user_id: 0
    };
  }

  async updateCommunity(id: number, userId: number, data: UpdateCommunityDTO): Promise<Community> {
    const isModerator = await this.prisma.communityUsers.findFirst({
      where: { community_id: id, user_id: userId, type: "moderator" }
    });
    if (!isModerator) throw new Error(MESSAGES.COMMUNITY.COMMUNITY_ERROR_ACCESS_DENIED);
    const updated = await this.prisma.communities.update({ where: { id }, data });
    return {
      id: updated.id,
      name: updated.name,
      description: updated.description || "",
      banner: updated.banner || "",
      icon: updated.icon || "",
      category_id: updated.category_id || undefined,
      creator_user_id: userId
    };
  }

  async deleteCommunity(id: number, userId: number): Promise<void> {
    const isModerator = await this.prisma.communityUsers.findFirst({
      where: { community_id: id, user_id: userId, type: "moderator" }
    });
    if (!isModerator) throw new Error(MESSAGES.COMMUNITY.COMMUNITY_ERROR_ACCESS_DENIED);
    await this.prisma.communities.delete({ where: { id } });
  }

  async joinCommunity(communityId: number, userId: number): Promise<void> {
    await this.prisma.communityUsers.create({
      data: { community_id: communityId, user_id: userId, type: "member" }
    });
  }
}
