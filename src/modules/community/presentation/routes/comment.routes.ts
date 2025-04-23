import { Router } from "express";
import { CommentController } from "../controllers/comment.controller";
import { asyncHandler } from "../../../../middlewares/async_handler";
import { authenticateToken } from "../../../../middlewares/authenticate_token";

const router = Router();
const controller = new CommentController();

/**
 * @openapi
 * /api/v1/community/comment/publication/{publicationId}:
 *   post:
 *     tags: [Community Comments]
 *     summary: Create comment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: publicationId
 *         required: true
 *         schema: { type: number }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment: { type: string }
 *     responses:
 *       201: { description: Comment created }
 *
 *   get:
 *     tags: [Community Comments]
 *     summary: Get comments by publication
 *     parameters:
 *       - in: path
 *         name: publicationId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200: { description: List of comments }
 *
 * /api/v1/community/comment/{id}:
 *   patch:
 *     tags: [Community Comments]
 *     summary: Update comment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: number }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment: { type: string }
 *     responses:
 *       200: { description: Comment updated }
 *       403: { description: Unauthorized }
 *
 *   delete:
 *     tags: [Community Comments]
 *     summary: Delete comment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: number }
 *     responses:
 *       204: { description: Deleted }
 *       403: { description: Unauthorized }
 */

router.post("/comment/publication/:publicationId", authenticateToken, asyncHandler((req, res) => controller.create(req, res)));
router.get("/comment/publication/:publicationId", asyncHandler((req, res) => controller.getByPublication(req, res)));
router.patch("/comment/:id", authenticateToken, asyncHandler((req, res) => controller.update(req, res)));
router.delete("/comment/:id", authenticateToken, asyncHandler((req, res) => controller.delete(req, res)));

export default router;
