import { ArticleCategoryRepository } from "../../data/repository/article_category.repository";
import {
  CreateArticleCategoryDto,
  UpdateArticleCategoryDto,
} from "../../domain/dtos/article_category.dto";
import { ArticleCategory } from "../../domain/entities/article_category.entity";
import { AppError } from "../../../../utils/errors";
import { HttpStatusCodes } from "../../../../constants";

/**
 * Servicio para gestionar operaciones de negocio relacionadas con categorías de artículos
 */
export class ArticleCategoryService {
  private readonly repository: ArticleCategoryRepository;

  constructor() {
    this.repository = new ArticleCategoryRepository();
  }

  /**
   * Crea una nueva categoría de artículo
   * @param data Datos para crear la categoría
   */
  public async createCategory(
    data: CreateArticleCategoryDto
  ): Promise<ArticleCategory> {
    try {
      return await this.repository.createCategory(data);
    } catch (error) {
      throw new AppError(
        "Error al crear la categoría de artículo",
        HttpStatusCodes.INTERNAL_SERVER_ERROR.code
      );
    }
  }

  /**
   * Obtiene todas las categorías de artículos
   */
  public async getAllCategories(): Promise<ArticleCategory[]> {
    try {
      return await this.repository.getAllCategories();
    } catch (error) {
      throw new AppError(
        "Error al obtener las categorías de artículos",
        HttpStatusCodes.INTERNAL_SERVER_ERROR.code
      );
    }
  }

  /**
   * Obtiene una categoría de artículo por su ID
   * @param id Identificador de la categoría
   */
  public async getCategoryById(id: number): Promise<ArticleCategory> {
    try {
      const category = await this.repository.getCategoryById(id);

      if (!category) {
        throw new AppError(
          "Categoría de artículo no encontrada",
          HttpStatusCodes.NOT_FOUND.code
        );
      }

      return category;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        "Error al obtener la categoría de artículo",
        HttpStatusCodes.INTERNAL_SERVER_ERROR.code
      );
    }
  }

  /**
   * Actualiza una categoría de artículo existente
   * @param id Identificador de la categoría
   * @param data Datos para actualizar
   */
  public async updateCategory(
    id: number,
    data: UpdateArticleCategoryDto
  ): Promise<ArticleCategory> {
    try {
      // Verificar si la categoría existe
      await this.getCategoryById(id);

      return await this.repository.updateCategory(id, data);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        "Error al actualizar la categoría de artículo",
        HttpStatusCodes.INTERNAL_SERVER_ERROR.code
      );
    }
  }

  /**
   * Elimina una categoría de artículo por su ID
   * @param id Identificador de la categoría
   */
  public async deleteCategory(
    id: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Verificar si la categoría existe
      await this.getCategoryById(id);

      await this.repository.deleteCategory(id);

      return {
        success: true,
        message: "Categoría de artículo eliminada correctamente",
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        "Error al eliminar la categoría de artículo",
        HttpStatusCodes.INTERNAL_SERVER_ERROR.code
      );
    }
  }
}
