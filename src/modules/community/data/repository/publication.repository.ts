import { PrismaClient } from "@prisma/client";
import { CreatePublicationDTO } from "../../domain/dtos/create_publication.dto";
import { UpdatePublicationDTO } from "../../domain/dtos/update_publication.dto";
import { Publication } from "../../domain/entities/publication.entity";
import { MESSAGES } from "../../../../constants/messages";

export class PublicationRepository {
  private prisma = new PrismaClient();

  async create(communityId: number, data: CreatePublicationDTO, userId: number): Promise<Publication> {
    const communityUser = await this.prisma.communityUsers.findFirst({
      where: { user_id: userId, community_id: communityId }
    });
    if (!communityUser) throw new Error(MESSAGES.COMMUNITY.PUBLICATION_ERROR_ACCESS_DENIED);

    const pub = await this.prisma.publications.create({
      data: {
        title: data.title,
        description: data.description,
        multimedia: data.multimedia,
        link: data.link,
        community_id: communityId,
        community_user_id: communityUser.id
      }
    });

    return {
      id: pub.id,
      title: pub.title,
      description: pub.description,
      multimedia: pub.multimedia || undefined,
      link: pub.link || undefined,
      community_id: pub.community_id,
      community_user_id: pub.community_user_id,
      created_at: pub.creation_timestamp
    };
  }

  async getByCommunityId(communityId: number): Promise<Publication[]> {
    const pubs = await this.prisma.publications.findMany({ where: { community_id: communityId } });
    return pubs.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      multimedia: p.multimedia || undefined,
      link: p.link || undefined,
      community_id: p.community_id,
      community_user_id: p.community_user_id,
      created_at: p.creation_timestamp
    }));
  }

  async getById(id: number): Promise<Publication | null> {
    const p = await this.prisma.publications.findUnique({ where: { id } });
    if (!p) return null;
    return {
      id: p.id,
      title: p.title,
      description: p.description,
      multimedia: p.multimedia || undefined,
      link: p.link || undefined,
      community_id: p.community_id,
      community_user_id: p.community_user_id,
      created_at: p.creation_timestamp
    };
  }

  async update(id: number, userId: number, data: UpdatePublicationDTO): Promise<Publication> {
    const pub = await this.prisma.publications.findUnique({ where: { id } });
    if (!pub) throw new Error(MESSAGES.COMMUNITY.PUBLICATION_ERROR_NOT_FOUND);
    const communityUser = await this.prisma.communityUsers.findUnique({ where: { id: pub.community_user_id } });
    if (!communityUser || communityUser.user_id !== userId) throw new Error(MESSAGES.COMMUNITY.PUBLICATION_ERROR_ACCESS_DENIED);

    const updated = await this.prisma.publications.update({ where: { id }, data });
    return {
      id: updated.id,
      title: updated.title,
      description: updated.description,
      multimedia: updated.multimedia || undefined,
      link: updated.link || undefined,
      community_id: updated.community_id,
      community_user_id: updated.community_user_id,
      created_at: updated.creation_timestamp
    };
  }

  async delete(id: number, userId: number): Promise<void> {
      const pub = await this.prisma.publications.findUnique({ where: { id } });
      if (!pub) throw new Error(MESSAGES.COMMUNITY.PUBLICATION_ERROR_NOT_FOUND);
      const communityUser = await this.prisma.communityUsers.findUnique({ where: { id: pub.community_user_id } });
      if (!communityUser || communityUser.user_id !== userId) throw new Error(MESSAGES.COMMUNITY.PUBLICATION_ERROR_ACCESS_DENIED);
      await this.prisma.publications.delete({ where: { id } });
    }

    async getPublicationsPaginated(communityId: number, skip: number, take: number): Promise<Publication[]> {
    const pubs = await this.prisma.publications.findMany({
      where: { community_id: communityId },
      skip,
      take
    });

    return pubs.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      multimedia: p.multimedia || undefined,
      link: p.link || undefined,
      community_id: p.community_id,
      community_user_id: p.community_user_id,
      created_at: p.creation_timestamp
    }));
  }

  async countPublicationsByCommunity(communityId: number): Promise<number> {
    return this.prisma.publications.count({
      where: { community_id: communityId }
    });
  }
}
