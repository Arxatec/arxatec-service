import { ArticleRepository } from "../../data/repository/article.repository";
import { CreateArticleDTO } from "../../domain/dtos/create_article.dto";
import { UpdateArticleDTO } from "../../domain/dtos/update_article.dto";
import { Article } from "../../domain/entities/article.entity";
import { MESSAGES } from "../../../../constants/messages";
import prisma from "../../../../config/prisma_client";
import { HttpStatusCodes } from "../../../../constants";
import { AppError } from "../../../../utils/errors";

export class ArticleService {
  constructor(private articleRepository: ArticleRepository) {}

  async createArticle(
    userId: number,
    data: CreateArticleDTO
  ): Promise<Article> {
    // Buscar en la tabla Users (no en userDetails)
    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user || user.status !== "active") {
      throw new AppError(
        MESSAGES.ARTICLE.ARTICLE_ERROR_ACCESS_DENIED,
        HttpStatusCodes.UNAUTHORIZED.code
      );
    }

    console.log(data);

    return this.articleRepository.create(userId, data);
  }

  async getAllArticles(): Promise<any[]> {
    return this.articleRepository.getAll();
  }

  async getArticleById(articleId: number): Promise<any> {
    const article = await this.articleRepository.getById(articleId);
    if (!article) {
      throw new AppError(
        MESSAGES.ARTICLE.ARTICLE_ERROR_NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );
    }
    return article;
  }

  async updateArticle(
    articleId: number,
    userId: number,
    data: UpdateArticleDTO
  ): Promise<any> {
    return this.articleRepository.update(articleId, userId, data);
  }

  async deleteArticle(articleId: number, userId: number): Promise<any> {
    return this.articleRepository.delete(articleId, userId);
  }
}
