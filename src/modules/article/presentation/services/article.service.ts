import { PrismaClient } from "@prisma/client";
import { ArticleRepository } from "../../data/repository/article.repository";
import { CreateArticleDTO } from "../../domain/dtos/create_article.dto";
import { Article } from "../../domain/entities/article.entity";

export class ArticleService {
  constructor(private articleRepository: ArticleRepository) {}

  async createArticle(data: CreateArticleDTO): Promise<Article> {
    const prisma = new PrismaClient();
    // Buscar el usuario que intenta crear el artículo
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    // Si no se encuentra el usuario o no está activo, lanzar error
    if (!user || user.status !== "active") {
      throw new Error("Aun no es usuario de ArxaTEC");
    }
    return this.articleRepository.create(data);
  }
}
