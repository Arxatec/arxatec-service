import { Router } from "express";
import { CommentReplyController } from "../controllers/comment_reply.controller";
import { asyncHandler } from "../../../../middlewares/async_handler";
import { authenticateToken } from "../../../../middlewares/authenticate_token";

const router = Router();
const controller = new CommentReplyController();

/**
 * @openapi
 * /api/v1/community/reply/comment/{commentId}:
 *   post:
 *     tags: [Comment Reply]
 *     summary: Crear respuesta a comentario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema: { type: number }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reply: { type: string }
 *     responses:
 *       201: { description: Respuesta creada }
 *
 *   get:
 *     tags: [Comment Reply]
 *     summary: Obtener respuestas por comentario
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema: { type: number }
 *     responses:
 *       200: { description: Lista de respuestas }
 *
 * /api/v1/community/reply/{id}:
 *   patch:
 *     tags: [Comment Reply]
 *     summary: Actualizar respuesta
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
 *               reply: { type: string }
 *     responses:
 *       200: { description: Respuesta actualizada }
 *       403: { description: No autorizado }
 *
 *   delete:
 *     tags: [Comment Reply]
 *     summary: Eliminar respuesta
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: number }
 *     responses:
 *       204: { description: Eliminado }
 *       403: { description: No autorizado }
 */

router.post("/reply/comment/:commentId", authenticateToken, asyncHandler((req, res) => controller.create(req, res)));
router.get("/reply/comment/:commentId", asyncHandler((req, res) => controller.getByComment(req, res)));
router.patch("/reply/:id", authenticateToken, asyncHandler((req, res) => controller.update(req, res)));
router.delete("/reply/:id", authenticateToken, asyncHandler((req, res) => controller.delete(req, res)));

export default router;