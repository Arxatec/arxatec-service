import { Router } from "express";
import articleRoutes from "./article.routes";
import { articleCategoryRouter } from "./article-category.routes";

/**
 * Configuración de todas las rutas relacionadas con artículos
 */
export const setupArticleRoutes = (): Router => {
  const router = Router();

  // Rutas de artículos
  router.use("/articles", articleRoutes);

  // Rutas de categorías de artículos
  router.use("/articles/categories", articleCategoryRouter());

  return router;
};
