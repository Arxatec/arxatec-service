import { Request, Response } from "express";
import { ArticleCategoryService } from "../services/article_category.service";
import {
  CreateArticleCategoryDto,
  UpdateArticleCategoryDto,
} from "../../domain/dtos/article_category.dto";
import { handleServerError } from "../../../../utils/error_handler";

/**
 * Controlador para gestionar operaciones CRUD de categorías de artículos
 */
export class ArticleCategoryController {
  private readonly service: ArticleCategoryService;

  constructor() {
    this.service = new ArticleCategoryService();
  }

  /**
   * Crea una nueva categoría de artículo
   */
  public async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryData: CreateArticleCategoryDto = req.body;
      const newCategory = await this.service.createCategory(categoryData);

      res.status(201).json({
        success: true,
        data: newCategory,
      });
    } catch (error) {
      handleServerError(res, req, error);
    }
  }

  /**
   * Obtiene todas las categorías de artículos
   */
  public async getAllCategories(_req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.service.getAllCategories();

      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      handleServerError(res, _req, error);
    }
  }

  /**
   * Obtiene una categoría de artículo por su ID
   */
  public async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: "ID de categoría inválido",
        });
        return;
      }

      const category = await this.service.getCategoryById(id);

      res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      handleServerError(res, req, error);
    }
  }

  /**
   * Actualiza una categoría de artículo existente
   */
  public async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: "ID de categoría inválido",
        });
        return;
      }

      const categoryData: UpdateArticleCategoryDto = req.body;
      const updatedCategory = await this.service.updateCategory(
        id,
        categoryData
      );

      res.status(200).json({
        success: true,
        data: updatedCategory,
      });
    } catch (error) {
      handleServerError(res, req, error);
    }
  }

  /**
   * Elimina una categoría de artículo por su ID
   */
  public async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: "ID de categoría inválido",
        });
        return;
      }

      const result = await this.service.deleteCategory(id);

      res.status(200).json(result);
    } catch (error) {
      handleServerError(res, req, error);
    }
  }
}
