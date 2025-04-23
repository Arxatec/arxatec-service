import { Router } from "express";
import { PublicationController } from "../controllers/publication.controller";
import { asyncHandler } from "../../../../middlewares/async_handler";
import { authenticateToken } from "../../../../middlewares/authenticate_token";

const router = Router();
const controller = new PublicationController();

/**
 * @openapi
 * /api/v1/community/{communityId}/publication:
 *   post:
 *     tags: [Community Publication]
 *     summary: Crear publicación
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: communityId
 *         required: true
 *         schema: { type: number }
 *     responses:
 *       201: { description: Publicación creada }
 *
 *   get:
 *     tags: [Community Publication]
 *     summary: Obtener publicaciones por comunidad
 *     parameters:
 *       - in: path
 *         name: communityId
 *         required: true
 *         schema: { type: number }
 *     responses:
 *       200: { description: Lista de publicaciones }
 *
 * /api/v1/community/publication/{id}:
 *   get:
 *     tags: [Community Publication]
 *     summary: Obtener publicación por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: number }
 *     responses:
 *       200: { description: Publicación encontrada }
 *
 *   patch:
 *     tags: [Community Publication]
 *     summary: Actualizar publicación
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: number }
 *     responses:
 *       200: { description: Publicación actualizada }
 *
 *   delete:
 *     tags: [Community Publication]
 *     summary: Eliminar publicación
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: number }
 *     responses:
 *       204: { description: Publicación eliminada }
 */

router.post("/:communityId/publication", authenticateToken, asyncHandler((req, res) => controller.create(req, res)));
router.get("/:communityId/publication", asyncHandler((req, res) => controller.getByCommunity(req, res)));
router.get("/publication/:id", asyncHandler((req, res) => controller.getById(req, res)));
router.patch("/publication/:id", authenticateToken, asyncHandler((req, res) => controller.update(req, res)));
router.delete("/publication/:id", authenticateToken, asyncHandler((req, res) => controller.delete(req, res)));

export default router;
