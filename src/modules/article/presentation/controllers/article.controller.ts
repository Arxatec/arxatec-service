import { Request, Response } from "express";
import { ArticleService } from "../services/article.service";
import { ArticleRepository } from "../../data/repository/article.repository";
import { CreateArticleDTO } from "../../domain/dtos/create_article.dto";
import { CreateArticleSchema } from "../../domain/dtos/create_article.dto";
import { z } from "zod";

export const UpdateArticleSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  banner: z.string().optional(),
  categoryId: z.number().optional(),
});

const articleRepository = new ArticleRepository();
const articleService = new ArticleService(articleRepository);

interface AuthenticatedRequest extends Request {
  user: { id: number };
}

export class ArticleController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const authReq = req as AuthenticatedRequest;
      if (!authReq.user)
        return res.status(401).json({ error: "No autenticado" });

      const data = CreateArticleSchema.parse(req.body) as CreateArticleDTO;
      const article = await articleService.createArticle(authReq.user.id, data);
      return res.status(201).json(article);
    } catch (error) {
      return res.status(400).json({
        message: "Error al crear el artículo",
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  async getAll(_req: Request, res: Response): Promise<Response> {
    try {
      const articles = await articleService.getAllArticles();
      return res.status(200).json(articles);
    } catch (error) {
      return res.status(400).json({
        message: "Error al obtener los artículos",
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const article = await articleService.getArticleById(Number(id));
      return res.status(200).json(article);
    } catch (error) {
      return res.status(404).json({
        message: "Artículo no encontrado",
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const authReq = req as AuthenticatedRequest;
      if (!authReq.user)
        return res.status(401).json({ error: "No autenticado" });

      const { id } = req.params;
      const data = UpdateArticleSchema.parse(req.body);
      const updatedArticle = await articleService.updateArticle(
        Number(id),
        authReq.user.id,
        data
      );
      return res.status(200).json(updatedArticle);
    } catch (error) {
      return res.status(400).json({
        message: "Error al actualizar el artículo",
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const authReq = req as AuthenticatedRequest;
      if (!authReq.user)
        return res.status(401).json({ error: "No autenticado" });

      const { id } = req.params;
      await articleService.deleteArticle(Number(id), authReq.user.id);
      return res
        .status(200)
        .json({ message: "Artículo eliminado correctamente" });
    } catch (error) {
      return res.status(400).json({
        message: "Error al eliminar el artículo",
        error: error instanceof Error ? error.message : error,
      });
    }
  }
}
