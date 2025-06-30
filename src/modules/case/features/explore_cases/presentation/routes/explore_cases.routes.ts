// src/modules/case/features/explore_cases/presentation/routes/explore_cases.routes.ts
import { Router } from "express";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { ExploreCasesController } from "../controller/explore_cases.controller";

const router = Router();
const ctrl = new ExploreCasesController();

/**
 * @swagger
 * /cases/explore:
 *   get:
 *     summary: Explore public cases
 *     description: |
 *       Devuelve una lista de casos públicos filtrados por categoría, estado o abogado.
 *       Este endpoint es público (no requiere autenticación).
 *     tags: [Cases]
 *     parameters:
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *         example: 2
 *       - in: query
 *         name: status_id
 *         schema:
 *           type: integer
 *         description: ID del estado
 *         example: 1
 *       - in: query
 *         name: lawyer_id
 *         schema:
 *           type: integer
 *         description: ID del abogado asignado
 *         example: 5
 *     responses:
 *       200:
 *         description: List of public cases
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
 *                   example: /api/v1/cases/explore
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-06-30T15:30:00Z"
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
 *                             example: 123
 *                           title:
 *                             type: string
 *                             example: "Divorcio express"
 *                           description:
 *                             type: string
 *                             example: "Solicito divorcio por mutuo acuerdo"
 *                           category_id:
 *                             type: integer
 *                             example: 2
 *                           status_id:
 *                             type: integer
 *                             example: 1
 *                           urgency:
 *                             type: string
 *                             example: alta
 *                           is_public:
 *                             type: boolean
 *                             example: true
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-06-30T10:00:00Z"
 */

/**
 * @swagger
 * /cases/categories:
 *   get:
 *     summary: List case categories
 *     description: |
 *       Devuelve el catálogo de categorías de casos.
 *       Este endpoint es público.
 *     tags: [Cases]
 *     responses:
 *       200:
 *         description: List of case categories
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
 *                   example: /api/v1/cases/categories
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-06-30T15:30:00Z"
 *                 data:
 *                   type: object
 *                   properties:
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "Derecho de familia"
 *                           description:
 *                             type: string
 *                             example: "Casos relacionados con divorcios y custodia"
 */

/**
 * @swagger
 * /cases/statuses:
 *   get:
 *     summary: List case statuses
 *     description: |
 *       Devuelve el catálogo de estados de casos.
 *       Este endpoint es público.
 *     tags: [Cases]
 *     responses:
 *       200:
 *         description: List of case statuses
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
 *                   example: /api/v1/cases/statuses
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-06-30T15:30:00Z"
 *                 data:
 *                   type: object
 *                   properties:
 *                     statuses:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "Registrado"
 *                           description:
 *                             type: string
 *                             example: "Caso creado y pendiente de asignación"
 */

router.get("/explore",   asyncHandler(ctrl.explore.bind(ctrl)));
router.get("/categories",asyncHandler(ctrl.categories));
router.get("/statuses",  asyncHandler(ctrl.statuses));

export { router as exploreCasesRoutes };


