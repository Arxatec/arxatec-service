import { Request, Response } from "express";
import { ArticleService } from "../services/article.service";
import { CreateArticleSchema } from "../../domain/dtos/create_article.dto";
import { UpdateArticleSchema } from "../../domain/dtos/update_article.dto";
import { HttpStatusCodes } from "../../../../constants/http_status_codes";
import { buildHttpResponse } from "../../../../utils/build_http_response";
import { handleServerError } from "../../../../utils/error_handler";
import { MESSAGES } from "../../../../constants/messages";
import { ArticleRepository } from "../../data/repository/article.repository";
import { AppError } from "../../../../utils/errors";
import { stripHtmlTags } from "../../../../utils/string_utils";
import { ArticleApi } from "../../data/api/article.api";

const articleRepository = new ArticleRepository();
const articleApi = new ArticleApi();
const articleService = new ArticleService(articleRepository, articleApi);

interface AuthenticatedRequest extends Request {
  user: { id: number };
}
interface ArticleCreateRequest {
  files?: {
    banner?: Express.Multer.File[];
    content?: Express.Multer.File[];
    [fieldname: string]: Express.Multer.File[] | undefined;
  };
  body: any;
}

export class ArticleController {
  async create(req: Request, res: Response): Promise<Response> {
    const articleReq = req as ArticleCreateRequest;
    const minContentCharacters = 500;
    const bannerFile = articleReq.files?.banner?.[0];
    const contentFile = articleReq.files?.content?.[0];

    try {
      const authReq = req as AuthenticatedRequest;
      if (!authReq.user) {
        return res
          .status(HttpStatusCodes.UNAUTHORIZED.code)
          .json(
            buildHttpResponse(
              HttpStatusCodes.UNAUTHORIZED.code,
              "Unauthorized",
              "/articles",
              null
            )
          );
      }

      const maxBannerSizeBytes = 5 * 1024 * 1024; // 5 MB en bytes
      const allowedBannerTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      if (!bannerFile) {
        throw new AppError(
          "The 'banner' file is required.",
          HttpStatusCodes.BAD_REQUEST.code
        );
      }

      if (!allowedBannerTypes.includes(bannerFile.mimetype)) {
        throw new AppError(
          "File type for 'banner' not allowed. Only JPEG, PNG, GIF or WebP.",
          HttpStatusCodes.BAD_REQUEST.code
        );
      }

      if (bannerFile.size > maxBannerSizeBytes) {
        throw new AppError(
          `Banner file size exceeds the limit (${
            maxBannerSizeBytes / 1024 / 1024
          }MB).`,
          HttpStatusCodes.BAD_REQUEST.code
        );
      }

      if (!contentFile) {
        throw new AppError(
          "The 'content' file is required.",
          HttpStatusCodes.BAD_REQUEST.code
        );
      }

      const fileContentString = contentFile.buffer.toString("utf-8");
      const cleanedContent = stripHtmlTags(fileContentString);
      const characterCount = cleanedContent.length;

      if (characterCount <= minContentCharacters) {
        throw new AppError(
          `Content must have more than ${minContentCharacters} characters.`,
          HttpStatusCodes.BAD_REQUEST.code
        );
      }

      const data = CreateArticleSchema.parse(req.body);
      const article = await articleService.createArticle(
        authReq.user.id,
        data,
        contentFile,
        bannerFile
      );
      return res
        .status(HttpStatusCodes.CREATED.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.CREATED.code,
            MESSAGES.ARTICLE.ARTICLE_SUCCESS_CREATED,
            req.path,
            article
          )
        );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      // Validar que los parámetros sean números positivos
      if (page < 1 || limit < 1) {
        return res
          .status(HttpStatusCodes.BAD_REQUEST.code)
          .json(
            buildHttpResponse(
              HttpStatusCodes.BAD_REQUEST.code,
              "Page and limit must be positive numbers.",
              "/articles",
              null
            )
          );
      }

      const articles = await articleService.getAllArticles(page, limit);
      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            "Articles retrieved successfully.",
            "/articles",
            articles
          )
        );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const article = await articleService.getArticleById(id);
      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            "Article retrieved successfully.",
            `/articles/${id}`,
            article
          )
        );
    } catch (error) {
      const errResp = buildHttpResponse(
        HttpStatusCodes.NOT_FOUND.code,
        error instanceof Error
          ? error.message
          : MESSAGES.ARTICLE.ARTICLE_ERROR_FETCHING,
        req.params.id ? `/articles/${req.params.id}` : "/articles",
        null
      );
      return res.status(HttpStatusCodes.NOT_FOUND.code).json(errResp);
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const authReq = req as AuthenticatedRequest;
      if (!authReq.user) {
        return res
          .status(HttpStatusCodes.UNAUTHORIZED.code)
          .json(
            buildHttpResponse(
              HttpStatusCodes.UNAUTHORIZED.code,
              "Unauthorized",
              "/articles",
              null
            )
          );
      }

      const articleReq = req as ArticleCreateRequest;
      const { id } = req.params;
      const data = UpdateArticleSchema.parse(req.body);

      const updatedArticle = await articleService.updateArticle(
        id,
        authReq.user.id,
        data,
        articleReq.files
      );

      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            MESSAGES.ARTICLE.ARTICLE_SUCCESS_UPDATED,
            `/articles/${id}`,
            updatedArticle
          )
        );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const authReq = req as AuthenticatedRequest;
      if (!authReq.user) {
        return res
          .status(HttpStatusCodes.UNAUTHORIZED.code)
          .json(
            buildHttpResponse(
              HttpStatusCodes.UNAUTHORIZED.code,
              "Unauthorized",
              "/articles",
              null
            )
          );
      }
      const { id } = req.params;
      const deletedArticle = await articleService.deleteArticle(
        id,
        authReq.user.id
      );
      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            MESSAGES.ARTICLE.ARTICLE_SUCCESS_DELETED,
            req.params.id ? `/articles/${req.params.id}` : "/articles",
            deletedArticle
          )
        );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }
}
