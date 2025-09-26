// src/modules/cases/features/manage/list_my_cases/presentation/list_my_cases.routes.ts
import { Router } from "express";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { ListMyCasesController } from "./list_my_cases.controller";

const router = Router();
const ctrl = new ListMyCasesController();

/**
 * Get my cases
 * @openapi
 * /cases/me:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cases - Manage
 *     summary: "List cases of the authenticated user"
 *     description: "Devuelve la lista de casos creados o asignados al usuario autenticado (**cliente** o **abogado**)."
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número de página para la paginación (por defecto 1).
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Cantidad de resultados por página (máximo 100).
 *     responses:
 *       '200':
 *         description: "OK - Lista de casos obtenida"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 200 }
 *                 message: { type: string, example: "OK" }
 *                 description: { type: string, example: "OK" }
 *                 timestamp: { type: string, example: "2025-09-16T10:30:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/me" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     cases:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: string, format: uuid, example: "b3a2b9b6-7d82-4f21-9c8e-123456789abc" }
 *                           title: { type: string, example: "Demanda por incumplimiento" }
 *                           status_id: { type: string, format: uuid, example: "stat-01" }
 *                           category_id: { type: string, format: uuid, example: "cat-01" }
 *                           is_public: { type: boolean, example: true }
 *                           created_at: { type: string, format: date-time, example: "2025-08-25T12:00:00.000Z" }
 *                     meta:
 *                       type: object
 *                       properties:
 *                         total: { type: integer, example: 25 }
 *                         page: { type: integer, example: 1 }
 *                         limit: { type: integer, example: 10 }
 *                         totalPages: { type: integer, example: 3 }
 *                     user:
 *                       type: object
 *                       properties:
 *                         id: { type: string, format: uuid, example: "user-01" }
 *                         role: { type: string, enum: [client, lawyer], example: "client" }
 *       '400':
 *         description: "Bad Request - parámetros inválidos de paginación"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 400 }
 *                 message: { type: string, example: "Bad Request" }
 *                 description: { type: string, example: "El límite no puede ser mayor a 100" }
 *                 path: { type: string, example: "/api/v1/cases/me" }
 *                 timestamp: { type: string, example: "2025-09-16T10:30:00.000Z" }
 *       '401':
 *         description: "Unauthorized - Token de autenticación inválido o no proporcionado"
 *       '500':
 *         description: "Internal Server Error"
 */

router.get("/", authenticateToken, asyncHandler(ctrl.handle.bind(ctrl)));

export { router as listMyCasesRoutes };
