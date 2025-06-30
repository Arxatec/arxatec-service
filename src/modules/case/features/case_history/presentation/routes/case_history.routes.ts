import { Router } from "express";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { GetCaseHistoryController } from "../controllers/case_history.controller";

const router = Router();
const controller = new GetCaseHistoryController();
/**
 * @swagger
 * /cases/{id}/history:
 *   get:
 *     summary: Get case change history
 *     description: |
 *       Devuelve el historial de cambios de un caso.
 *       Incluye transiciones de estado, archivado y cualquier otro cambio relevante.
 *       **Reglas:**
 *       - Requiere autenticación.
 *       - Solo usuarios con acceso al caso deben consumir este endpoint (puedes añadir validación si deseas).
 *     tags: [Cases]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del caso
 *         schema:
 *           type: integer
 *           example: 123
 *     responses:
 *       200:
 *         description: Case history retrieved successfully
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
 *                   example: Case history retrieved
 *                 path:
 *                   type: string
 *                   example: /api/v1/cases/123/history
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-06-30T14:30:00Z"
 *                 data:
 *                   type: object
 *                   properties:
 *                     history:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 789
 *                           field:
 *                             type: string
 *                             example: "status"
 *                           old_value:
 *                             type: string
 *                             example: "Registrado"
 *                           new_value:
 *                             type: string
 *                             example: "En proceso"
 *                           note:
 *                             type: string
 *                             nullable: true
 *                             example: "Cambio realizado por abogado"
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-06-30T14:00:00Z"
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
 *       404:
 *         description: No history found for the case
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.get("/:id/history", authenticateToken, asyncHandler(controller.getHistory));

export { router as CaseHistoryRoutes };
