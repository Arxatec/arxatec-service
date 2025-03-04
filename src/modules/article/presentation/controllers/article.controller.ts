import { Request, Response } from "express";
import { ArticleService } from "../services/article.service";
import { ArticleRepository } from "../../data/repository/article.repository";
import { CreateArticleDTO } from "../../domain/dtos/create_article.dto";

const articleRepository = new ArticleRepository();
const articleService = new ArticleService(articleRepository);

export class ArticleController {
  async create(req: Request, res: Response): Promise<Response> {
    const dto = req.body as CreateArticleDTO;
    try {
      const article = await articleService.createArticle(dto);
      return res.status(201).json(article);
    } catch (error) {
      return res.status(500).json({
        message: "Error al crear el artículo",
        error: (error as Error).message,
      });
    }
  }
}
