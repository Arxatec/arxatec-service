import { PrismaClient } from "@prisma/client";
import { ArticleRepository, UpdateArticleDTO } from "../../data/repository/article.repository";
import { CreateArticleDTO } from "../../domain/dtos/create_article.dto";
import { Article } from "../../domain/entities/article.entity";

export class ArticleService {
  constructor(private articleRepository: ArticleRepository) {}

  async createArticle(userId: number, data: CreateArticleDTO): Promise<Article> {
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.status !== "active") {
      throw new Error("Aun no es usuario de ArxaTEC");
    }
    return this.articleRepository.create(userId, data);
  }

  async getAllArticles(): Promise<any[]> {
    return this.articleRepository.getAll();
  }

  async getArticleById(articleId: number): Promise<any> {
    const article = await this.articleRepository.getById(articleId);
    if (!article) {
      throw new Error("Artículo no encontrado");
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
