import { CommentReplyRepository } from "../../data/repository/comment_reply.repository";
import { CreateCommentReplyDTO } from "../../domain/dtos/create_comment_reply.dto";
import { UpdateCommentReplyDTO } from "../../domain/dtos/update_comment_reply.dto";
import { CommentReply } from "../../domain/entities/comment_reply.entity";
import { MESSAGES } from "../../../../constants/messages";

export class CommentReplyService {
  constructor(private repo: CommentReplyRepository) {}

  async create(comment_id: number, user_id: number, data: CreateCommentReplyDTO): Promise<CommentReply> {
    try {
      return await this.repo.create(comment_id, user_id, data);
    } catch (error) {
      throw new Error(MESSAGES.COMMUNITY.COMMENT_REPLY_ERROR_CREATING);
    }
  }

  async getByComment(comment_id: number): Promise<CommentReply[]> {
    try {
      return await this.repo.getByComment(comment_id);
    } catch (error) {
      throw new Error(MESSAGES.COMMUNITY.COMMENT_REPLY_ERROR_LISTING);
    }
  }

  async update(id: number, user_id: number, data: UpdateCommentReplyDTO): Promise<CommentReply> {
    try {
      return await this.repo.update(id, user_id, data);
    } catch (error) {
      throw new Error(MESSAGES.COMMUNITY.COMMENT_REPLY_ERROR_UPDATING);
    }
  }

  async delete(id: number, user_id: number): Promise<void> {
    try {
      return await this.repo.delete(id, user_id);
    } catch (error) {
      throw new Error(MESSAGES.COMMUNITY.COMMENT_REPLY_ERROR_DELETING);
    }
  }
}
