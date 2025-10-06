// src/modules/user/features/list_users/docs/index.ts
/**
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
 *         schema: { type: integer, minimum: 1, example: 1 }
 *         description: "Número de página (por defecto: 1)."
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, example: 10 }
 *         description: "Cantidad de registros por página (por defecto: 10)."
 *       - in: query
 *         name: q
 *         schema: { type: string, example: "juan" }
 *         description: "Texto de búsqueda (nombre, apellido o email)."
 *     responses:
 *       "200":
 *         description: "Lista de usuarios obtenida correctamente"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 200 }
 *                 message: { type: string, example: "OK" }
 *                 path: { type: string, example: "/api/v1/user/list" }
 *                 timestamp: { type: string, example: "2025-09-15T20:30:00.000Z" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: string, example: "84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *                           first_name: { type: string, example: "Juan" }
 *                           last_name: { type: string, example: "Pérez" }
 *                           email: { type: string, format: email, example: "juan.perez@example.com" }
 *                     meta:
 *                       type: object
 *                       properties:
 *                         totalItems: { type: integer, example: 50 }
 *                         totalPages: { type: integer, example: 5 }
 *                         currentPage: { type: integer, example: 1 }
 *                         pageSize: { type: integer, example: 10 }
 *       "401":
 *         description: "Unauthorized"
 *       "500":
 *         description: "Internal Server Error"
 */
