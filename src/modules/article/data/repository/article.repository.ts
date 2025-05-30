import { article_status } from "@prisma/client";
import { Article } from "../../domain/entities/article.entity";
import { CreateArticleDTO } from "../../domain/dtos/create_article.dto";
import { UpdateArticleDTO } from "../../domain/dtos/update_article.dto";
import { MESSAGES } from "../../../../constants/messages";
import prisma from "../../../../config/prisma_client";
import { HttpStatusCodes } from "../../../../constants";
import { AppError } from "../../../../utils/errors";

interface PaginationParams {
  page: number;
  limit: number;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export class ArticleRepository {
  async create(
    userId: number,
    data: CreateArticleDTO,
    content: string,
    banner: string,
    resume: string,
    readingTime: number
  ): Promise<Article> {
    const created = await prisma.articles.create({
      data: {
        user_id: userId,
        title: data.title,
        content: content,
        banner: banner,
        resume: resume,
        reading_time: readingTime,
        publication_timestamp: new Date(),
        status: "accepted" as article_status,
        category_id: Number(data.categoryId),
      },
    });
    return {
      id: created.id,
      userId: created.user_id,
      title: created.title,
      content: created.content,
      banner: created.banner,
      resume: created.resume,
      readingTime: created.reading_time,
      categoryId: created.category_id,
      publicationTimestamp: created.publication_timestamp,
      status: created.status,
    };
  }

  async getAll(params: PaginationParams): Promise<PaginatedResponse<any>> {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      prisma.articles.findMany({
        skip,
        take: limit,
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
        orderBy: {
          publication_timestamp: "desc",
        },
      }),
      prisma.articles.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: articles,
      total,
      totalPages,
      currentPage: page,
      limit,
    };
  }

  async getById(articleId: string): Promise<any | null> {
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
    articleId: string,
    userId: number,
    data: UpdateArticleDTO,
    bannerUrl: string,
    contentUrl: string,
    resume: string,
    readingTime: number
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
        content: contentUrl,
        banner: bannerUrl,
        resume: resume,
        reading_time: readingTime,
        category_id: Number(data.categoryId),
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
  }

  async delete(articleId: string, userId: number): Promise<any> {
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
