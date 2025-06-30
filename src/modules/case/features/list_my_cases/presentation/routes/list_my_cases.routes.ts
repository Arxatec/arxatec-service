// src/modules/cases/features/list_my_cases/presentation/routes/list_my_cases.routes.ts
import { Router } from "express";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { ListMyCasesController } from "../controllers/list_my_cases.controller";

const router = Router();
const ctrl = new ListMyCasesController();
/**
 * @swagger
 * /cases/me:
 *   get:
 *     summary: List my cases
 *     description: |
 *       Devuelve los casos activos (no archivados) del usuario autenticado.
 *       - Si el usuario es cliente, muestra los casos donde es el creador.
 *       - Si es abogado, muestra los casos donde es el abogado asignado.
 *     tags: [Cases]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user cases
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
 *                   example: /api/v1/cases/me
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 data:
 *                   type: object
 *                   properties:
 *                     cases:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 45
 *                           title:
 *                             type: string
 *                             example: "Divorcio express"
 *                           status_id:
 *                             type: integer
 *                             example: 1
 *                           category_id:
 *                             type: integer
 *                             example: 2
 *                           is_public:
 *                             type: boolean
 *                             example: true
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-06-30T12:00:00Z"
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
 */

router.get("/me", authenticateToken, asyncHandler(ctrl.handle.bind(ctrl)));

export { router as listMyCasesRoutes };
