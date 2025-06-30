import { Router } from "express";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { CaseDetailController } from "../controllers/case_detail.controller";

const router = Router();
const controller = new CaseDetailController();
/**
 * @swagger
 * /cases/{id}/detail:
 *   get:
 *     summary: Get detailed information of a case
 *     description: |
 *       Devuelve los datos completos de un caso, incluyendo:
 *       - categoría
 *       - estado
 *       - adjuntos activos
 *       - historial de cambios
 *       - información básica del servicio asociado
 *       **Restricciones:**
 *       - Solo el cliente creador o el abogado asignado pueden consultar el detalle.
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
 *           example: 123
 *     responses:
 *       200:
 *         description: Detalle del caso recuperado correctamente
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
 *                   example: /api/v1/cases/123/detail
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
 *                           example: 123
 *                         title:
 *                           type: string
 *                           example: "Divorcio express"
 *                         description:
 *                           type: string
 *                           example: "El cliente solicita divorcio por mutuo acuerdo."
 *                         category:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 2
 *                             name:
 *                               type: string
 *                               example: "Derecho de familia"
 *                         status:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             name:
 *                               type: string
 *                               example: "Registrado"
 *                         urgency:
 *                           type: string
 *                           example: alta
 *                         is_public:
 *                           type: boolean
 *                           example: true
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-06-30T10:00:00Z"
 *                         service:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 456
 *                             lawyer_id:
 *                               type: integer
 *                               nullable: true
 *                               example: 8
 *                             client_id:
 *                               type: integer
 *                               nullable: true
 *                               example: 5
 *                             external_client_id:
 *                               type: integer
 *                               nullable: true
 *                               example: null
 *                         attachments:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 77
 *                               label:
 *                                 type: string
 *                                 example: "Acta de matrimonio"
 *                               category_id:
 *                                 type: integer
 *                                 example: 1
 *                               uploaded_by:
 *                                 type: string
 *                                 enum: [client, lawyer]
 *                                 example: client
 *                               created_at:
 *                                 type: string
 *                                 format: date-time
 *                                 example: "2025-06-30T12:00:00Z"
 *                         histories:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 33
 *                               field:
 *                                 type: string
 *                                 example: "status"
 *                               old_value:
 *                                 type: string
 *                                 example: "Registrado"
 *                               new_value:
 *                                 type: string
 *                                 example: "En proceso"
 *                               created_at:
 *                                 type: string
 *                                 format: date-time
 *                                 example: "2025-06-30T13:00:00Z"
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 5
 *                         role:
 *                           type: string
 *                           enum: [client, lawyer]
 *                           example: client
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
 */

router.get("/:id/detail", authenticateToken, asyncHandler(controller.get));

export { router as caseDetailRoutes };
