import { Router } from "express";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { ArchiveCaseController } from "../controllers/archive_case.controller";

const controller = new ArchiveCaseController();
const router = Router();
/**
 * @swagger
 * /cases/{id}/archive:
 *   patch:
 *     summary: Archive a case
 *     description: |
 *       Archiva un caso existente.
 *       **Reglas:**
 *       - Solo el cliente creador o el abogado asignado pueden archivar el caso.
 *       - No puede archivarse un caso que ya está archivado.
 *     tags: [Cases]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del caso a archivar
 *         schema:
 *           type: integer
 *           example: 123
 *     responses:
 *       200:
 *         description: Case archived successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Case archived
 *                 path:
 *                   type: string
 *                   example: /api/v1/cases/123/archive
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-06-30T14:00:00Z"
 *                 data:
 *                   type: object
 *                   properties:
 *                     archivedCase:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                           example: Case archived successfully
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 5
 *                         role:
 *                           type: string
 *                           enum: [client, lawyer]
 *                           example: lawyer
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Case not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Case already archived
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.patch("/:id/archive", authenticateToken, asyncHandler(controller.archive));

export { router as archiveCaseRoutes };