import { Router } from "express";
import { CommunityController } from "../controllers/community.controller";
import { asyncHandler } from "../../../../middlewares/async_handler";
import { authenticateToken } from "../../../../middlewares/authenticate_token";
import publicationRoutes from "./publication.routes";
import commentRoutes from "./comment.routes";
import commentReplyRoutes from "./comment_reply.routes";
import reactionRoutes from "./reaction.routes";

const router = Router();
const controller = new CommunityController();

/**
 * @openapi
 * /api/v1/community:
 *   post:
 *     tags: [Community]
 *     summary: Crear comunidad
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               banner:
 *                 type: string
 *               icon:
 *                 type: string
 *               category_id:
 *                 type: number
 *     responses:
 *       201:
 *         description: Comunidad creada
 *
 *   get:
 *     tags: [Community]
 *     summary: Obtener todas las comunidades
 *     responses:
 *       200:
 *         description: Lista de comunidades
 *
 * /api/v1/community/{id}:
 *   get:
 *     tags: [Community]
 *     summary: Obtener una comunidad
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Comunidad encontrada
 *       404:
 *         description: Comunidad no encontrada
 *
 *   patch:
 *     tags: [Community]
 *     summary: Actualizar comunidad
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               banner:
 *                 type: string
 *               icon:
 *                 type: string
 *               category_id:
 *                 type: number
 *     responses:
 *       200:
 *         description: Comunidad actualizada
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Comunidad no encontrada
 *
 *   delete:
 *     tags: [Community]
 *     summary: Eliminar comunidad
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       204:
 *         description: Eliminado correctamente
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Comunidad no encontrada
 *
 * /api/v1/community/{id}/join:
 *   post:
 *     tags: [Community]
 *     summary: Unirse a una comunidad
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Usuario unido correctamente
 */

router.use("/", publicationRoutes);
router.use("/", commentRoutes);
router.use("/", commentReplyRoutes);
router.use("/", reactionRoutes);

router.post("/", authenticateToken, asyncHandler((req, res) => controller.createCommunity(req, res)));
router.get("/", asyncHandler((req, res) => controller.getAllCommunities(req, res)));
router.post("/:id/join", authenticateToken, asyncHandler((req, res) => controller.joinCommunity(req, res)));
router.patch("/:id", authenticateToken, asyncHandler((req, res) => controller.updateCommunity(req, res)));
router.delete("/:id", authenticateToken, asyncHandler((req, res) => controller.deleteCommunity(req, res)));
router.get("/:id", asyncHandler((req, res) => controller.getCommunityById(req, res)));

export default router;
