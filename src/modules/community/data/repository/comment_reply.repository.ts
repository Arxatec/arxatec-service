import { PrismaClient } from "@prisma/client";
import { CreateCommentReplyDTO } from "../../domain/dtos/create_comment_reply.dto";
import { UpdateCommentReplyDTO } from "../../domain/dtos/update_comment_reply.dto";
import { CommentReply } from "../../domain/entities/comment_reply.entity";
import { MESSAGES } from "../../../../constants/messages";

export class CommentReplyRepository {
  private prisma = new PrismaClient();

  async create(comment_id: number, user_id: number, data: CreateCommentReplyDTO): Promise<CommentReply> {
    const community_user = await this.prisma.communityUsers.findFirst({ where: { user_id } });
    if (!community_user) throw new Error(MESSAGES.COMMUNITY.COMMENT_REPLY_ERROR_ACCESS_DENIED);

    const reply = await this.prisma.commentReplies.create({
      data: {
        reply: data.reply,
        comment_id,
        community_user_id: community_user.id
      }
    });

    return {
      id: reply.id,
      reply: reply.reply,
      comment_id: reply.comment_id,
      community_user_id: reply.community_user_id,
      created_at: reply.creation_timestamp
    };
  }

  async getByComment(comment_id: number): Promise<CommentReply[]> {
    const results = await this.prisma.commentReplies.findMany({ where: { comment_id } });
    return results.map(r => ({
      id: r.id,
      reply: r.reply,
      comment_id: r.comment_id,
      community_user_id: r.community_user_id,
      created_at: r.creation_timestamp
    }));
  }

  async update(id: number, user_id: number, data: UpdateCommentReplyDTO): Promise<CommentReply> {
    const reply = await this.prisma.commentReplies.findUnique({ where: { id } });
    if (!reply) throw new Error(MESSAGES.COMMUNITY.COMMENT_REPLY_ERROR_NOT_FOUND);

    const community_user = await this.prisma.communityUsers.findUnique({ where: { id: reply.community_user_id } });
    if (!community_user || community_user.user_id !== user_id) throw new Error(MESSAGES.COMMUNITY.COMMENT_REPLY_ERROR_ACCESS_DENIED);

    const updated = await this.prisma.commentReplies.update({ where: { id }, data });
    return {
      id: updated.id,
      reply: updated.reply,
      comment_id: updated.comment_id,
      community_user_id: updated.community_user_id,
      created_at: updated.creation_timestamp
    };
  }

  async delete(id: number, user_id: number): Promise<void> {
    const reply = await this.prisma.commentReplies.findUnique({ where: { id } });
    if (!reply) throw new Error(MESSAGES.COMMUNITY.COMMENT_REPLY_ERROR_NOT_FOUND);

    const community_user = await this.prisma.communityUsers.findUnique({ where: { id: reply.community_user_id } });
    if (!community_user || community_user.user_id !== user_id) throw new Error(MESSAGES.COMMUNITY.COMMENT_REPLY_ERROR_ACCESS_DENIED);

    await this.prisma.commentReplies.delete({ where: { id } });
  }
}
