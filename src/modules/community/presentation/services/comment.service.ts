import { CommentRepository } from "../../data/repository/comment.repository";
import { CreateCommentDTO } from "../../domain/dtos/create_comment.dto";
import { UpdateCommentDTO } from "../../domain/dtos/update_comment.dto";
import { Comment } from "../../domain/entities/comment.entity";
import { MESSAGES } from "../../../../constants/messages";

export class CommentService {
  constructor(private repo: CommentRepository) {}

  async create(publication_id: number, user_id: number, data: CreateCommentDTO): Promise<Comment> {
    try {
      return await this.repo.create(publication_id, user_id, data);
    } catch (error) {
      throw new Error(MESSAGES.COMMUNITY.COMMENT_ERROR_CREATING);
    }
  }

  async getByPublication(publication_id: number): Promise<Comment[]> {
    try {
      return await this.repo.getByPublication(publication_id);
    } catch (error) {
      throw new Error(MESSAGES.COMMUNITY.COMMENT_ERROR_LISTING);
    }
  }

  async update(id: number, user_id: number, data: UpdateCommentDTO): Promise<Comment> {
    try {
      return await this.repo.update(id, user_id, data);
    } catch (error) {
      throw new Error(MESSAGES.COMMUNITY.COMMENT_ERROR_UPDATING);
    }
  }

  async delete(id: number, user_id: number): Promise<void> {
    try {
      return await this.repo.delete(id, user_id);
    } catch (error) {
      throw new Error(MESSAGES.COMMUNITY.COMMENT_ERROR_DELETING);
    }
  }
}
