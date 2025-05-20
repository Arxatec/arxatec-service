/**
 * Entidad que representa una categoría de artículo en el dominio
 */
export interface ArticleCategory {
  readonly id: number;
  readonly name: string;
  readonly description: string | null;
}
