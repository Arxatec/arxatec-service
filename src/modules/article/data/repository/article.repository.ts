import { PrismaClient, article_status } from "@prisma/client";
import { Article } from "../../domain/entities/article.entity";
import { CreateArticleDTO } from "../../domain/dtos/create_article.dto";

// (Si se requiere, puedes definir también un DTO para actualizar, por ejemplo:)
export interface UpdateArticleDTO {
  title?: string;
  content?: string;
  banner?: string;
  categoryId?: number;
}

export class ArticleRepository {
  private prisma = new PrismaClient();

  async create(userId: number, data: CreateArticleDTO): Promise<Article> {
    const created = await this.prisma.article.create({
      data: {
        user_id: userId,
        title: data.title,
        content: data.content,
        banner: data.banner,
        publication_date: new Date(),
        publication_time: new Date(),
        status: "pending" as article_status,
        category_id: data.categoryId,
      },
    });

    return {
      id: created.id,
      userId: created.user_id,
      title: created.title,
      content: created.content,
      banner: created.banner ?? undefined,
      categoryId: created.category_id,
      publicationDate: created.publication_date,
      publicationTime: created.publication_time,
      status: created.status,
    };
  }

  async getAll(): Promise<any[]> {
    // Trae todos los artículos incluyendo el autor, la categoría y la especialidad (si existe)
    return await this.prisma.article.findMany({
      include: {
        user: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
        articleCategory: {
          select: { name: true },
        },
      },
    });
  }

  async getById(articleId: number): Promise<any | null> {
    return await this.prisma.article.findUnique({
      where: { id: articleId },
      include: {
        user: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
        articleCategory: {
          select: { name: true },
        },
      },
    });
  }

  async update(
    articleId: number,
    userId: number,
    data: UpdateArticleDTO
  ): Promise<any> {
    // Primero, se puede verificar que el artículo pertenezca al usuario (esto también se podría hacer en el service)
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
    });
    if (!article || article.user_id !== userId) {
      throw new Error("Acceso denegado o artículo no encontrado");
    }

    const updated = await this.prisma.article.update({
      where: { id: articleId },
      data: {
        title: data.title,
        content: data.content,
        banner: data.banner,
        category_id: data.categoryId,
        // Si se necesita actualizar la fecha/hora, se puede agregar lógica aquí.
      },
      include: {
        user: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
        articleCategory: {
          select: { name: true },
        },
      },
    });
    return updated;
  }

  async delete(articleId: number, userId: number): Promise<any> {
    // Verificar propiedad antes de borrar
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
    });
    if (!article || article.user_id !== userId) {
      throw new Error("Acceso denegado o artículo no encontrado");
    }
    return await this.prisma.article.delete({ where: { id: articleId } });
  }
}
