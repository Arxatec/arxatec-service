// src/modules/user/features/list_users/presentation/list_users.routes.ts
import { Router } from "express";
import { ListUsersController } from "./list_users.controller";
import { authenticateToken } from "../../../../../middlewares/authenticate_token";

const router = Router();
const controller = new ListUsersController();

/**
 * List users
 * @openapi
 * /user/list:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     summary: "List users"
 *     description: "Obtiene un listado paginado de usuarios. Permite filtrar por nombre, apellido o email usando el parámetro de búsqueda `q`."
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         description: "Número de página (por defecto: 1)."
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           example: 10
 *         description: "Cantidad de registros por página (por defecto: 10)."
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *           example: "juan"
 *         description: "Texto de búsqueda (nombre, apellido o email)."
 *     responses:
 *       '200':
 *         description: "Lista de usuarios obtenida correctamente"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "OK"
 *                 description:
 *                   type: string
 *                   example: "Users list"
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T20:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/user/list"
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "84ea6d2a-d171-48d0-af0f-74c8a5b2eb29"
 *                           first_name:
 *                             type: string
 *                             example: "Juan"
 *                           last_name:
 *                             type: string
 *                             example: "Pérez"
 *                           email:
 *                             type: string
 *                             format: email
 *                             example: "juan.perez@example.com"
 *                     meta:
 *                       type: object
 *                       properties:
 *                         totalItems:
 *                           type: integer
 *                           example: 50
 *                         totalPages:
 *                           type: integer
 *                           example: 5
 *                         currentPage:
 *                           type: integer
 *                           example: 1
 *                         pageSize:
 *                           type: integer
 *                           example: 10
 *       '401':
 *         description: "Unauthorized (token inválido o no enviado)"
 *       '500':
 *         description: "Error interno del servidor"
 */

router.get("/", authenticateToken, controller.handle.bind(controller));

export { router as listUsersRoutes };
