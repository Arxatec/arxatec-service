import { PrismaClient } from "@prisma/client";
import { ArticleRepository } from "../../data/repository/article.repository";
import { CreateArticleDTO } from "../../domain/dtos/create_article.dto";
import { UpdateArticleDTO } from "../../domain/dtos/update_article.dto";
import { Article } from "../../domain/entities/article.entity";
import { MESSAGES } from "../../../../constants/messages";
import { Pagination } from "../../../../utils/pagination";

export class ArticleService {
  constructor(private articleRepository: ArticleRepository) {}

  async createArticle(userId: number, data: CreateArticleDTO): Promise<Article> {
    const prisma = new PrismaClient();
    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user || user.status !== "active") {
      throw new Error(MESSAGES.ARTICLE.ARTICLE_ERROR_ACCESS_DENIED);
    }
    return this.articleRepository.create(userId, data);
  }

  async getAllArticlesPaginated(page: number, limit: number, skip: number): Promise<any> {
    const [data, total] = await Promise.all([
      this.articleRepository.getAllPaginated(skip, limit),
      this.articleRepository.count(),
    ]);

    return {
      data,
      meta: Pagination.buildPaginationMeta(total, page, limit),
    };
  }

  async getArticleById(articleId: number): Promise<any> {
    const article = await this.articleRepository.getById(articleId);
    if (!article) {
      throw new Error(MESSAGES.ARTICLE.ARTICLE_ERROR_NOT_FOUND);
    }
    return article;
  }

  async updateArticle(articleId: number, userId: number, data: UpdateArticleDTO): Promise<any> {
    return this.articleRepository.update(articleId, userId, data);
  }

  async deleteArticle(articleId: number, userId: number): Promise<any> {
    return this.articleRepository.delete(articleId, userId);
  }
}
