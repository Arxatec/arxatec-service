// src/modules/case/features/explore_cases/presentation/explore_cases.routes.ts
import { Router } from "express";
import { asyncHandler } from "../../../../../middlewares/async_handler";
import { ExploreCasesController } from "./explore_cases.controller";

const router = Router();
const ctrl = new ExploreCasesController();

/**
 * Explore public cases
 * @openapi
 * /cases/explore:
 *   get:
 *     tags:
 *       - Cases - Explore
 *     summary: "Explore public cases"
 *     description: "Lista casos públicos (no archivados). Soporta filtros y paginación."
 *     parameters:
 *       - in: query
 *         name: category_id
 *         schema: { type: string, format: uuid }
 *         required: false
 *         description: Filtra por categoría.
 *       - in: query
 *         name: status_id
 *         schema: { type: string, format: uuid }
 *         required: false
 *         description: Filtra por estado.
 *       - in: query
 *         name: lawyer_id
 *         schema: { type: string, format: uuid }
 *         required: false
 *         description: Filtra por abogado.
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, example: 1 }
 *         required: false
 *         description: Número de página (default 1).
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, example: 10 }
 *         required: false
 *         description: Tamaño de página (máx. 100).
 *     responses:
 *       '200':
 *         description: "OK"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 200 }
 *                 message: { type: string, example: "OK" }
 *                 description: { type: string, example: "OK" }
 *                 timestamp: { type: string, example: "2025-09-16T16:10:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/explore" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     cases:
 *                       type: array
 *                       items:
 *                         type: object
 *                         additionalProperties: true
 *                         properties:
 *                           id: { type: string, format: uuid, example: "84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *                           title: { type: string, example: "Consulta por contrato" }
 *                           category_id: { type: string, format: uuid, example: "9e1b1a7f-1c2d-4a5b-9c7e-123456789abc" }
 *                           status_id: { type: string, format: uuid, example: "7a9f6a49-7c5a-43c7-8b1e-9c2c9b3b8e13" }
 *                           is_public: { type: boolean, example: true }
 *                           created_at: { type: string, format: date-time, example: "2025-08-25T12:00:00.000Z" }
 *                     meta:
 *                       type: object
 *                       properties:
 *                         totalItems: { type: integer, example: 50 }
 *                         totalPages: { type: integer, example: 5 }
 *                         currentPage: { type: integer, example: 1 }
 *                         pageSize: { type: integer, example: 10 }
 *                     user:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id: { type: string, format: uuid, example: "user-123" }
 *                         role: { type: string, enum: [client, lawyer], example: "client" }
 *       '400':
 *         description: "Bad Request (validación de query)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 400 }
 *                 message: { type: string, example: "Bad Request" }
 *                 description:
 *                   type: string
 *                   oneOf:
 *                     - type: string
 *                       example: "El ID de la categoría debe tener formato UUID"
 *                     - type: string
 *                       example: "El ID del estado debe tener formato UUID"
 *                     - type: string
 *                       example: "El ID del abogado debe tener formato UUID"
 *                     - type: string
 *                       example: "La página debe ser un número entero"
 *                     - type: string
 *                       example: "El límite no puede ser mayor a 100"
 *                 path: { type: string, example: "/api/v1/cases/explore" }
 *                 timestamp: { type: string, example: "2025-09-16T16:10:00.000Z" }
 *       '500':
 *         description: "Internal Server Error"
 */
router.get("/", ctrl.explore);

/**
 * List case categories
 * @openapi
 * /cases/categories:
 *   get:
 *     tags:
 *       - Cases - Explore
 *     summary: "List categories"
 *     description: "Devuelve las categorías disponibles para los casos."
 *     responses:
 *       '200':
 *         description: "OK"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 200 }
 *                 message: { type: string, example: "OK" }
 *                 description: { type: string, example: "OK" }
 *                 timestamp: { type: string, example: "2025-09-16T16:10:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/categories" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: string, format: uuid, example: "9e1b1a7f-1c2d-4a5b-9c7e-123456789abc" }
 *                           name: { type: string, example: "Contratos" }
 *                     user:
 *                       type: object
 *                       nullable: true
 *       '500':
 *         description: "Internal Server Error"
 */
router.get("/", ctrl.categories);

/**
 * List case statuses
 * @openapi
 * /cases/status:
 *   get:
 *     tags:
 *       - Cases - Explore
 *     summary: "List status"
 *     description: "Devuelve los estados disponibles para los casos."
 *     responses:
 *       '200':
 *         description: "OK"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 200 }
 *                 message: { type: string, example: "OK" }
 *                 description: { type: string, example: "OK" }
 *                 timestamp: { type: string, example: "2025-09-16T16:10:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/statuses" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     statuses:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: string, format: uuid, example: "7a9f6a49-7c5a-43c7-8b1e-9c2c9b3b8e13" }
 *                           name: { type: string, example: "Abierto" }
 *                     user:
 *                       type: object
 *                       nullable: true
 *       '500':
 *         description: "Internal Server Error"
 */
router.get("/", ctrl.statuses);

export { router as exploreCasesRoutes };
