import { Router } from "express";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { ReopenCaseController } from "../controllers/reopen_case.controller";

const controller = new ReopenCaseController();
const router = Router();
/**
 * @swagger
 * /cases/{id}/reopen:
 *   patch:
 *     summary: Reopen an archived case
 *     description: |
 *       Restaura un caso previamente archivado.
 *       **Reglas:**
 *       - Solo el cliente creador o el abogado asignado pueden reabrir el caso.
 *       - Solo casos archivados pueden reabrirse.
 *       - Se registra un historial de cambio indicando la reapertura.
 *     tags: [Cases]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del caso a reabrir
 *         example: 123
 *     responses:
 *       200:
 *         description: Case reopened successfully
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
 *                   example: Case reopened
 *                 path:
 *                   type: string
 *                   example: /api/v1/cases/123/reopen
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 data:
 *                   type: object
 *                   properties:
 *                     case:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 123
 *                         archived:
 *                           type: boolean
 *                           example: false
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 7
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
 *         description: Case is not archived
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.patch("/cases/:id/reopen", authenticateToken, asyncHandler(controller.reopen));

export { router as reopenCaseRoutes };