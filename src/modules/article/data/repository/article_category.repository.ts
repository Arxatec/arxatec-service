import { PrismaClient } from "@prisma/client";
import { ArticleCategory } from "../../domain/entities/article_category.entity";
import {
  CreateArticleCategoryDto,
  UpdateArticleCategoryDto,
} from "../../domain/dtos/article_category.dto";

/**
 * Repositorio para gestionar operaciones CRUD de categorías de artículos
 */
export class ArticleCategoryRepository {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Crea una nueva categoría de artículo
   * @param data Datos para crear la categoría
   */
  public async createCategory(
    data: CreateArticleCategoryDto
  ): Promise<ArticleCategory> {
    return this.prisma.articleCategories.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });
  }

  /**
   * Obtiene todas las categorías de artículos
   */
  public async getAllCategories(): Promise<ArticleCategory[]> {
    return this.prisma.articleCategories.findMany();
  }

  /**
   * Obtiene una categoría de artículo por su ID
   * @param id Identificador de la categoría
   */
  public async getCategoryById(id: number): Promise<ArticleCategory | null> {
    return this.prisma.articleCategories.findUnique({
      where: { id },
    });
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
    return this.prisma.articleCategories.update({
      where: { id },
      data,
    });
  }

  /**
   * Elimina una categoría de artículo por su ID
   * @param id Identificador de la categoría
   */
  public async deleteCategory(id: number): Promise<ArticleCategory> {
    return this.prisma.articleCategories.delete({
      where: { id },
    });
  }
}
