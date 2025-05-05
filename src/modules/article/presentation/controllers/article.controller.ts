import { Request, Response } from "express";
import { ArticleService } from "../services/article.service";
import { CreateArticleSchema } from "../../domain/dtos/create_article.dto";
import { UpdateArticleSchema } from "../../domain/dtos/update_article.dto";
import { HttpStatusCodes } from "../../../../constants/http_status_codes";
import { buildHttpResponse } from "../../../../utils/build_http_response";
import { handleServerError } from "../../../../utils/error_handler";
import { MESSAGES } from "../../../../constants/messages";
import { ArticleRepository } from "../../data/repository/article.repository";

const articleRepository = new ArticleRepository();
const articleService = new ArticleService(articleRepository);

interface AuthenticatedRequest extends Request {
  user: { id: number };
}

export class ArticleController {
  async create(req: Request, res: Response): Promise<Response> {
    console.log(req.body);
    console.log(req.file);
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
      const data = CreateArticleSchema.parse(req.body);
      const article = await articleService.createArticle(authReq.user.id, data);
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

  async getAll(_req: Request, res: Response): Promise<Response> {
    try {
      const articles = await articleService.getAllArticles();
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
      return handleServerError(res, _req, error);
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const article = await articleService.getArticleById(Number(id));
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
      const { id } = req.params;
      const data = UpdateArticleSchema.parse(req.body);
      const updatedArticle = await articleService.updateArticle(
        Number(id),
        authReq.user.id,
        data
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
        Number(id),
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
