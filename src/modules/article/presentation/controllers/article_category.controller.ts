import { Request, Response } from "express";
import { ArticleCategoryService } from "../services/article_category.service";
import {
  CreateArticleCategoryDto,
  UpdateArticleCategoryDto,
} from "../../domain/dtos/article_category.dto";
import { handleServerError } from "../../../../utils/error_handler";
import { buildHttpResponse } from "../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../constants";

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

      res
        .status(HttpStatusCodes.CREATED.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.CREATED.code,
            "Category created successfully",
            req.path,
            newCategory
          )
        );
    } catch (error) {
      handleServerError(res, req, error);
    }
  }

  /**
   * Obtiene todas las categorías de artículos
   */
  public async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.service.getAllCategories();

      res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            "Categories retrieved successfully",
            req.path,
            categories
          )
        );
    } catch (error) {
      handleServerError(res, req, error);
    }
  }

  /**
   * Obtiene una categoría de artículo por su ID
   */
  public async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        res
          .status(HttpStatusCodes.BAD_REQUEST.code)
          .json(
            buildHttpResponse(
              HttpStatusCodes.BAD_REQUEST.code,
              "ID de categoría inválido",
              req.path
            )
          );
        return;
      }

      const category = await this.service.getCategoryById(id);

      res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            "Category retrieved successfully",
            req.path,
            category
          )
        );
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
        res
          .status(HttpStatusCodes.BAD_REQUEST.code)
          .json(
            buildHttpResponse(
              HttpStatusCodes.BAD_REQUEST.code,
              "ID de categoría inválido",
              req.path
            )
          );
        return;
      }

      const categoryData: UpdateArticleCategoryDto = req.body;
      const updatedCategory = await this.service.updateCategory(
        id,
        categoryData
      );

      res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            "Category updated successfully",
            req.path,
            updatedCategory
          )
        );
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
        res
          .status(HttpStatusCodes.BAD_REQUEST.code)
          .json(
            buildHttpResponse(
              HttpStatusCodes.BAD_REQUEST.code,
              "ID de categoría inválido",
              req.path
            )
          );
        return;
      }

      const result = await this.service.deleteCategory(id);

      res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            "Category deleted successfully",
            req.path,
            result
          )
        );
    } catch (error) {
      handleServerError(res, req, error);
    }
  }
}
