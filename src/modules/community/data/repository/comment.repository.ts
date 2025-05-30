import { PrismaClient } from "@prisma/client";
import { CreateCommentDTO } from "../../domain/dtos/create_comment.dto";
import { UpdateCommentDTO } from "../../domain/dtos/update_comment.dto";
import { Comment } from "../../domain/entities/comment.entity";
import { MESSAGES } from "../../../../constants/messages";

export class CommentRepository {
  private prisma = new PrismaClient();

  async create(publication_id: number, user_id: number, data: CreateCommentDTO): Promise<Comment> {
    const community_user = await this.prisma.communityUsers.findFirst({ where: { user_id } });
    if (!community_user) throw new Error(MESSAGES.COMMUNITY.COMMENT_ERROR_ACCESS_DENIED);

    const comment = await this.prisma.comments.create({
      data: {
        comment: data.comment,
        publication_id,
        community_user_id: community_user.id
      }
    });

    return {
      id: comment.id,
      comment: comment.comment,
      publication_id: comment.publication_id,
      community_user_id: comment.community_user_id,
      created_at: comment.creation_timestamp
    };
  }

  async getByPublication(publication_id: number): Promise<Comment[]> {
    const results = await this.prisma.comments.findMany({ where: { publication_id } });

    return results.map(c => ({
      id: c.id,
      comment: c.comment,
      publication_id: c.publication_id,
      community_user_id: c.community_user_id,
      created_at: c.creation_timestamp
    }));
  }

  async update(id: number, user_id: number, data: UpdateCommentDTO): Promise<Comment> {
    const comment = await this.prisma.comments.findUnique({ where: { id } });
    if (!comment) throw new Error(MESSAGES.COMMUNITY.COMMENT_ERROR_NOT_FOUND);

    const community_user = await this.prisma.communityUsers.findUnique({ where: { id: comment.community_user_id } });
    if (!community_user || community_user.user_id !== user_id) {
      throw new Error(MESSAGES.COMMUNITY.COMMENT_ERROR_ACCESS_DENIED);
    }

    const updated = await this.prisma.comments.update({ where: { id }, data });
    return {
      id: updated.id,
      comment: updated.comment,
      publication_id: updated.publication_id,
      community_user_id: updated.community_user_id,
      created_at: updated.creation_timestamp
    };
  }

  async delete(id: number, user_id: number): Promise<void> {
    const comment = await this.prisma.comments.findUnique({ where: { id } });
    if (!comment) throw new Error(MESSAGES.COMMUNITY.COMMENT_ERROR_NOT_FOUND);

    const community_user = await this.prisma.communityUsers.findUnique({ where: { id: comment.community_user_id } });
    if (!community_user || community_user.user_id !== user_id) {
      throw new Error(MESSAGES.COMMUNITY.COMMENT_ERROR_ACCESS_DENIED);
    }

    await this.prisma.comments.delete({ where: { id } });
  }
}
