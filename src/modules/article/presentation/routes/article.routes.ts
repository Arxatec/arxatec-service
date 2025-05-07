import { Router } from "express";
import { ArticleController } from "../controllers/article.controller";
import { asyncHandler } from "../../../../middlewares/async_handler";
import { authenticateToken } from "../../../../middlewares/authenticate_token";
import multer from "multer";

const router = Router();
const articleController = new ArticleController();

/**
 * @openapi
 * /api/v1/articles:
 *   post:
 *     tags:
 *       - Article
 *     summary: "Create a new article"
 *     description: >
 *       Allows an active user to publish an article.
 *       The user ID is obtained from the authentication token (Authorization: Bearer <token>).
 *       Only active users can publish articles.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - categoryId
 *               - banner
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Article Title"
 *               content:
 *                 type: string
 *                 example: "Full article content."
 *               categoryId:
 *                 type: number
 *                 example: 2
 *               banner:
 *                 type: string
 *                 format: uri
 *                 example: "http://example.com/banner.jpg"
 *     responses:
 *       '201':
 *         description: "Article created successfully."
 *   get:
 *     tags:
 *       - Article
 *     summary: "Retrieve all articles"
 *     description: >
 *       Returns a list of all articles with Title, Content, Banner, Author (first and last name),
 *       publication timestamp, and Category (name).
 *     responses:
 *       '200':
 *         description: "List of articles."
 *
 * /api/v1/articles/{id}:
 *   get:
 *     tags:
 *       - Article
 *     summary: "Retrieve a specific article"
 *     description: "Returns the details of an article by its ID."
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: "ID of the article"
 *     responses:
 *       '200':
 *         description: "Article found."
 *   patch:
 *     tags:
 *       - Article
 *     summary: "Update an article"
 *     description: >
 *       Allows updating an article only if it belongs to the logged-in user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: "ID of the article"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - categoryId
 *               - banner
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Title"
 *               content:
 *                 type: string
 *                 example: "Updated Content"
 *               categoryId:
 *                 type: number
 *                 example: 3
 *               banner:
 *                 type: string
 *                 format: uri
 *                 example: "http://example.com/updated_banner.jpg"
 *     responses:
 *       '200':
 *         description: "Article updated successfully."
 *   delete:
 *     tags:
 *       - Article
 *     summary: "Delete an article"
 *     description: >
 *       Allows deleting an article only if it belongs to the logged-in user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: "ID of the article"
 *     responses:
 *       '200':
 *         description: "Article deleted successfully."
 */

const upload = multer({ storage: multer.memoryStorage() });
router.post(
  "/",
  authenticateToken,
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "content", maxCount: 1 },
  ]),
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

// TODO: all fields are optional, but if the client no send data, should show error
router.patch(
  "/:id",
  authenticateToken,
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "content", maxCount: 1 },
  ]),
  asyncHandler((req, res) => articleController.update(req, res))
);

router.delete(
  "/:id",
  authenticateToken,
  asyncHandler((req, res) => articleController.delete(req, res))
);

export default router;
