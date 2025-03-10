import { Router } from "express";
import { ArticleController } from "../controllers/article.controller";
import { asyncHandler } from "../../../../middlewares/async_handler";
import { authenticateToken } from "../../../../middlewares/authenticate_token";

const router = Router();
const articleController = new ArticleController();

router.post(
  "/",
  authenticateToken,
  asyncHandler((req, res) => articleController.create(req, res))
);
router.get(
  "/",
  asyncHandler((req, res) => articleController.getAll(req, res))
);
router.get(
  "/:id",
  asyncHandler((req, res) => articleController.getById(req, res))
);
router.patch(
  "/:id",
  authenticateToken,
  asyncHandler((req, res) => articleController.update(req, res))
);
router.delete(
  "/:id",
  authenticateToken,
  asyncHandler((req, res) => articleController.delete(req, res))
);

export default router;
