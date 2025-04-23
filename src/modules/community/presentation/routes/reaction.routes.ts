import { Router } from "express";
import { ReactionController } from "../controllers/reaction.controller";
import { authenticateToken } from "../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../middlewares/async_handler";

const router = Router();
const controller = new ReactionController();

/**
 * @openapi
 * /api/v1/community/reaction:
 *   post:
 *     tags: [Reaction]
 *     summary: Crear o actualizar reacción
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               target_type:
 *                 type: string
 *                 enum: [publication, comment, reply]
 *               target_id:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [like, dislike]
 *     responses:
 *       200:
 *         description: Reacción registrada o actualizada.
 *
 * /api/v1/community/reaction/{target_type}/{target_id}:
 *   get:
 *     tags: [Reaction]
 *     summary: Obtener reacciones por recurso
 *     parameters:
 *       - name: target_type
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           enum: [publication, comment, reply]
 *       - name: target_id
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Lista de reacciones.
 *
 *   delete:
 *     tags: [Reaction]
 *     summary: Eliminar reacción
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: target_type
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: target_id
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       204:
 *         description: Reacción eliminada.
 */

router.post("/reaction", authenticateToken, asyncHandler((req, res) => controller.react(req, res)));
router.get("/reaction/:target_type/:target_id", asyncHandler((req, res) => controller.getByTarget(req, res)));
router.delete("/reaction/:target_type/:target_id", authenticateToken, asyncHandler((req, res) => controller.remove(req, res)));

export default router;
