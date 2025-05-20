import { ArticleRepository } from "../../data/repository/article.repository";
import { CreateArticleDTO } from "../../domain/dtos/create_article.dto";
import { UpdateArticleDTO } from "../../domain/dtos/update_article.dto";
import { MESSAGES } from "../../../../constants/messages";
import prisma from "../../../../config/prisma_client";
import { HttpStatusCodes } from "../../../../constants";
import { AppError } from "../../../../utils/errors";
import { uploadFile, deleteFile } from "../../../../infrastructure/aws";
import { ArticleApi } from "../../data/api/article.api";
import {
  estimateReadingTimeByCharacters,
  stripHtmlTags,
} from "../../../../utils";

export class ArticleService {
  constructor(
    private articleRepository: ArticleRepository,
    private articleApi: ArticleApi
  ) {}

  async createArticle(
    userId: number,
    data: CreateArticleDTO,
    content: Express.Multer.File,
    banner: Express.Multer.File
  ): Promise<any> {
    const user = await prisma.users.findUnique({ where: { id: userId } });
    const fileContentString = content.buffer.toString("utf-8");
    const cleanedContent = stripHtmlTags(fileContentString);
    let resume;
    if (!user || user.status !== "active") {
      throw new AppError(
        MESSAGES.ARTICLE.ARTICLE_ERROR_ACCESS_DENIED,
        HttpStatusCodes.UNAUTHORIZED.code
      );
    }

    const bannerResponse = await uploadFile(banner, "public/articles/banner");
    const contentResponse = await uploadFile(
      content,
      "public/articles/content"
    );
    try {
      resume = await this.articleApi.generateResume(cleanedContent);
    } catch (_) {
      resume = null;
    }
    const readingTime = estimateReadingTimeByCharacters(cleanedContent);
    const article = await this.articleRepository.create(
      userId,
      data,
      contentResponse.url,
      bannerResponse.url,
      resume,
      readingTime
    );
    return {
      message: "Article created successfully",
      article,
    };
  }

  async getAllArticles(page: number = 1, limit: number = 10): Promise<any> {
    return this.articleRepository.getAll({ page, limit });
  }

  async getArticleById(articleId: string): Promise<any> {
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
    articleId: string,
    userId: number,
    data: UpdateArticleDTO,
    files?: {
      banner?: Express.Multer.File[];
      content?: Express.Multer.File[];
    }
  ): Promise<any> {
    const article = await this.articleRepository.getById(articleId);
    if (!article) {
      throw new AppError(
        MESSAGES.ARTICLE.ARTICLE_ERROR_NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );
    }

    if (article.user_id !== userId) {
      throw new AppError(
        MESSAGES.ARTICLE.ARTICLE_ERROR_ACCESS_DENIED,
        HttpStatusCodes.UNAUTHORIZED.code
      );
    }

    let bannerUrl = article.banner;
    let contentUrl = article.content;
    let readingTime = article.reading_time;
    let resume = article.resume;

    let updatedData = {
      title: data.title,
      categoryId: data.categoryId,
    };

    if (files?.banner?.[0]) {
      const bannerFile = files.banner[0];
      const bannerResponse = await uploadFile(
        bannerFile,
        "public/articles/banner"
      );
      bannerUrl = bannerResponse.url;
      const oldBannerKey = article.banner.split(".amazonaws.com/")[1];
      await deleteFile(oldBannerKey);
    }

    if (files?.content?.[0]) {
      const contentFile = files.content[0];
      const fileContentString = contentFile.buffer.toString("utf-8");
      const cleanedContent = stripHtmlTags(fileContentString);
      const contentResponse = await uploadFile(
        contentFile,
        "public/articles/content"
      );
      contentUrl = contentResponse.url;
      readingTime = estimateReadingTimeByCharacters(cleanedContent);
      try {
        resume = await this.articleApi.generateResume(cleanedContent);
      } catch (_) {
        resume = article.resume;
      }
      const oldContentKey = article.content.split(".amazonaws.com/")[1];
      await deleteFile(oldContentKey);
    }

    const updatedArticle = await this.articleRepository.update(
      articleId,
      userId,
      updatedData,
      bannerUrl,
      contentUrl,
      resume,
      readingTime
    );

    return {
      message: "Article updated successfully",
      article: updatedArticle,
    };
  }

  async deleteArticle(articleId: string, userId: number): Promise<any> {
    const article = await this.articleRepository.getById(articleId);
    if (!article) {
      throw new AppError(
        MESSAGES.ARTICLE.ARTICLE_ERROR_NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );
    }

    if (article.user_id !== userId) {
      throw new AppError(
        MESSAGES.ARTICLE.ARTICLE_ERROR_ACCESS_DENIED,
        HttpStatusCodes.UNAUTHORIZED.code
      );
    }

    const bannerKey = article.banner.split(".amazonaws.com/")[1];
    const contentKey = article.content.split(".amazonaws.com/")[1];

    await Promise.all([deleteFile(bannerKey), deleteFile(contentKey)]);

    return this.articleRepository.delete(articleId, userId);
  }
}
