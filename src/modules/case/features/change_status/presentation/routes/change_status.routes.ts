import { Router } from "express";

import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { ChangeStatusController } from "../controller/change_status.controller";

const router = Router();
const ctrl   = new ChangeStatusController();
/**
 * @swagger
 * /cases/{id}/status:
 *   patch:
 *     summary: Change the status of a case
 *     description: |
 *       Cambia el estado de un caso legal.
 *       **Reglas:**
 *       - Solo abogados pueden hacer transiciones hacia atrás (retroceder estado).
 *       - Clientes solo pueden avanzar al siguiente estado.
 *       - No puede cambiarse el estado si el caso está cerrado.
 *       - Para avanzar de "Registrado" a "Tomado", se asigna automáticamente el abogado si no hay asignado.
 *       - Solo el abogado asignado puede cerrar el caso.
 *       - Máximo 5 casos "Tomados" por abogado.
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status_id:
 *                 type: integer
 *                 description: Nuevo ID de estado
 *                 example: 2
 *               note:
 *                 type: string
 *                 description: Comentario opcional del cambio
 *                 example: "Cambio solicitado por el cliente"
 *             required:
 *               - status_id
 *     responses:
 *       200:
 *         description: Case status changed successfully
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
 *                   example: OK
 *                 path:
 *                   type: string
 *                   example: /api/v1/cases/123/status
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-06-30T15:00:00Z"
 *                 data:
 *                   type: object
 *                   properties:
 *                     case:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                           example: Status changed successfully
 *                         status:
 *                           type: string
 *                           example: "En proceso"
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
 *       400:
 *         description: Validation error (Zod)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Access denied or invalid permissions
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
 *         description: Invalid state transition or business rule conflict
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.patch(
  "/:id/status",
  authenticateToken,
  asyncHandler(ctrl.patch),
);

export { router as changeStatusRoutes };
