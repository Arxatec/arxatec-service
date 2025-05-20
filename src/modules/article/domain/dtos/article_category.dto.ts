/**
 * DTO para crear una nueva categoría de artículo
 */
export interface CreateArticleCategoryDto {
  readonly name: string;
  readonly description?: string;
}

/**
 * DTO para actualizar una categoría de artículo existente
 */
export interface UpdateArticleCategoryDto {
  readonly name?: string;
  readonly description?: string;
}

/**
 * DTO para respuestas de categoría de artículo
 */
export interface ArticleCategoryResponseDto {
  readonly id: number;
  readonly name: string;
  readonly description?: string;
}
