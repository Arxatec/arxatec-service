import { article_status } from "@prisma/client";
import { Article } from "../../domain/entities/article.entity";
import { CreateArticleDTO } from "../../domain/dtos/create_article.dto";
import { UpdateArticleDTO } from "../../domain/dtos/update_article.dto";
import { MESSAGES } from "../../../../constants/messages";
import prisma from "../../../../config/prisma_client";
import { HttpStatusCodes } from "../../../../constants";
import { AppError } from "../../../../utils/errors";

export class ArticleRepository {
  async create(userId: number, data: CreateArticleDTO): Promise<Article> {
    const created = await prisma.articles.create({
      data: {
        user_id: userId,
        title: data.title,
        content: data.content,
        banner: data.banner,
        publication_timestamp: new Date(),
        status: "pending" as article_status,
        category_id: data.categoryId,
      },
    });
    return {
      id: created.id,
      userId: created.user_id,
      title: created.title,
      content: created.content,
      banner: created.banner ?? "",
      categoryId: created.category_id,
      publication_timestamp: created.publication_timestamp,
      status: created.status,
    };
  }

  async getAll(): Promise<any[]> {
    return await prisma.articles.findMany({
      include: {
        userDetails: {
          select: {
            user: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
        articleCategory: { select: { name: true } },
      },
    });
  }

  async getById(articleId: number): Promise<any | null> {
    return await prisma.articles.findUnique({
      where: { id: articleId },
      include: {
        userDetails: {
          select: {
            user: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
        articleCategory: { select: { name: true } },
      },
    });
  }

  async update(
    articleId: number,
    userId: number,
    data: UpdateArticleDTO
  ): Promise<any> {
    const article = await prisma.articles.findUnique({
      where: { id: articleId },
    });
    if (!article || article.user_id !== userId) {
      throw new Error(MESSAGES.ARTICLE.ARTICLE_ERROR_ACCESS_DENIED);
    }
    const updated = await prisma.articles.update({
      where: { id: articleId },
      data: {
        title: data.title,
        content: data.content,
        banner: data.banner,
        category_id: data.categoryId,
      },
      include: {
        userDetails: {
          select: {
            user: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
        articleCategory: { select: { name: true } },
      },
    });
    return updated;
  }

  async delete(articleId: number, userId: number): Promise<any> {
    const article = await prisma.articles.findUnique({
      where: { id: articleId },
    });
    if (!article || article.user_id !== userId) {
      throw new AppError(
        MESSAGES.ARTICLE.ARTICLE_ERROR_ACCESS_DENIED,
        HttpStatusCodes.UNAUTHORIZED.code
      );
    }
    return await prisma.articles.delete({ where: { id: articleId } });
  }
}
