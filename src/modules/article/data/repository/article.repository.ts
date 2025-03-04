import { PrismaClient, article_status } from "@prisma/client";
import { Article } from "../../domain/entities/article.entity";
import { CreateArticleDTO } from "../../domain/dtos/create_article.dto";

export class ArticleRepository {
  private prisma = new PrismaClient();

  async create(data: CreateArticleDTO): Promise<Article> {
    const created = await this.prisma.article.create({
      data: {
        user_id: data.userId,
        title: data.title,
        content: data.content,
        publication_date: new Date(),
        publication_time: new Date(),
        status: "pending" as article_status,
      },
    });

    return {
      id: created.id,
      userId: created.user_id,
      title: created.title,
      content: created.content,
      publicationDate: created.publication_date,
      publicationTime: created.publication_time,
      status: created.status,
    };
  }
}
