import { Router } from "express";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { UpdateCaseController } from "../controllers/update_case.controller";

const router = Router();
const ctrl = new UpdateCaseController();
/**
 * @swagger
 * tags:
 *   - name: Cases
 *     description: Operations related to legal cases
 */

/**
 * @swagger
 * /cases/{id}:
 *   patch:
 *     summary: Update a case
 *     description: |
 *       Actualiza los datos permitidos de un caso existente.
 *       **Restricciones:**
 *       - No puede estar archivado.
 *       - No puede estar cerrado.
 *       - Solo el creador (client) o el abogado asignado pueden actualizarlo.
 *     tags: [Cases]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID numérico del caso
 *         schema:
 *           type: integer
 *           example: 15
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 120
 *                 example: "Divorcio express actualizado"
 *               description:
 *                 type: string
 *                 minLength: 20
 *                 maxLength: 2000
 *                 example: "El cliente solicita actualización de los términos de divorcio por mutuo acuerdo."
 *               category_id:
 *                 type: integer
 *                 example: 2
 *               urgency:
 *                 type: string
 *                 enum: [alta, media, baja]
 *                 example: "media"
 *               is_public:
 *                 type: boolean
 *                 example: false
 *               reference_code:
 *                 type: string
 *                 example: "REF-UPDATED-1234"
 *             additionalProperties: false
 *     responses:
 *       200:
 *         description: Caso actualizado correctamente
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
 *                   example: /api/v1/cases/15
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
 *                         id:
 *                           type: integer
 *                           example: 15
 *                         title:
 *                           type: string
 *                           example: "Divorcio express actualizado"
 *                         category_id:
 *                           type: integer
 *                           example: 2
 *                         urgency:
 *                           type: string
 *                           example: "media"
 *                         is_public:
 *                           type: boolean
 *                           example: false
 *                         reference_code:
 *                           type: string
 *                           example: "REF-UPDATED-1234"
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 3
 *                         role:
 *                           type: string
 *                           enum: [client, lawyer]
 *                           example: lawyer
 *       400:
 *         description: Error de validación (Zod)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Acceso denegado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Caso no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Conflicto de estado (archivado o cerrado)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */


router.patch("/:id", authenticateToken, asyncHandler(ctrl.patch));

export { router as updateCaseRoutes };
