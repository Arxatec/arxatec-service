import { Router } from "express";
import { ArticleCategoryController } from "../controllers/article_category.controller";
import { asyncHandler } from "../../../../middlewares/async_handler";

export const articleCategoryRouter = (): Router => {
  const router = Router();
  const controller = new ArticleCategoryController();

  router.post(
    "/",
    asyncHandler((req, res) => controller.createCategory(req, res))
  );

  router.get(
    "/",
    asyncHandler((req, res) => controller.getAllCategories(req, res))
  );

  router.get(
    "/:id",
    asyncHandler((req, res) => controller.getCategoryById(req, res))
  );

  router.put(
    "/:id",
    asyncHandler((req, res) => controller.updateCategory(req, res))
  );

  router.delete(
    "/:id",
    asyncHandler((req, res) => controller.deleteCategory(req, res))
  );

  return router;
};
