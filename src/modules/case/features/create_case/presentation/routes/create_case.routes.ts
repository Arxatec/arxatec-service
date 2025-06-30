// src/modules/cases/features/create_case/presentation/routes/create_case.routes.ts
import { Router } from "express";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { CreateCaseController } from "../controllers/create_case.controller";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";

const router = Router();
const controller = new CreateCaseController();
/**
 * @swagger
 * tags:
 *   - name: Cases
 *     description: Operations related to legal cases
 */

/**
 * @swagger
 * /cases:
 *   post:
 *     summary: Create a new case
 *     description: |
 *       Crea un caso legal para un cliente o un abogado.
 *       **Reglas de negocio:**
 *       - Si el usuario es `client`, el caso es público por defecto.
 *       - Si el usuario es `lawyer`, puede crear el caso para un `external_client_id`.
 *       - Si `selected_lawyer_id` es enviado, el caso se asigna a ese abogado.
 *       - Valida que el cliente externo pertenezca al abogado autenticado.
 *       - Aplica límites máximos de casos activos.
 *     tags: [Cases]
 *     security:
 *       - BearerAuth: []
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
 *                 example: "Divorcio express"
 *               description:
 *                 type: string
 *                 minLength: 20
 *                 maxLength: 2000
 *                 example: "Solicito divorcio por mutuo acuerdo con custodia compartida."
 *               category_id:
 *                 type: integer
 *                 example: 2
 *               urgency:
 *                 type: string
 *                 enum: [alta, media, baja]
 *                 example: alta
 *               status_id:
 *                 type: integer
 *                 description: Si se omite, se asigna automáticamente según rol.
 *                 example: 1
 *               is_public:
 *                 type: boolean
 *                 example: true
 *               selected_lawyer_id:
 *                 type: integer
 *                 example: 5
 *               external_client_id:
 *                 type: integer
 *                 example: 3
 *               reference_code:
 *                 type: string
 *                 example: "REF-CASE-001"
 *             required:
 *               - title
 *               - description
 *               - category_id
 *     responses:
 *       201:
 *         description: Caso creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Caso creado exitosamente
 *                 path:
 *                   type: string
 *                   example: /api/v1/cases
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
 *                         service_id:
 *                           type: integer
 *                           example: 456
 *                         title:
 *                           type: string
 *                           example: "Divorcio express"
 *                         description:
 *                           type: string
 *                           example: "Solicito divorcio por mutuo acuerdo con custodia compartida."
 *                         category_id:
 *                           type: integer
 *                           example: 2
 *                         status_id:
 *                           type: integer
 *                           example: 1
 *                         urgency:
 *                           type: string
 *                           example: alta
 *                         is_public:
 *                           type: boolean
 *                           example: true
 *                         reference_code:
 *                           type: string
 *                           example: "REF-CASE-001"
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
 *         description: Acceso denegado o cliente externo inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Límite de casos activos excedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */


router.post("/", authenticateToken, asyncHandler(controller.handle.bind(controller)));

export { router as createCaseRoutes };
