// src/modules/case/features/associations/external_clients/get_list/docs/index.ts
/**
 * List external clients
 * @openapi
 * /cases/external-clients/list:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cases - Associations - External Clients
 *     summary: "List external clients"
 *     description: "Lista los clientes externos del abogado autenticado. Soporta búsqueda y paginación."
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema: { type: integer, minimum: 1, example: 1 }
 *         description: Número de página.
 *       - in: query
 *         name: limit
 *         required: false
 *         schema: { type: integer, minimum: 1, maximum: 100, example: 10 }
 *         description: Tamaño de página.
 *       - in: query
 *         name: search
 *         required: false
 *         schema: { type: string, minLength: 1, example: "maria" }
 *         description: Texto de búsqueda por nombre, email, teléfono o DNI.
 *     responses:
 *       '200':
 *         description: "External clients"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:      { type: number, example: 200 }
 *                 message:     { type: string, example: "OK" }
 *                 description: { type: string, example: "External clients" }
 *                 timestamp:   { type: string, example: "2025-09-16T19:00:00.000Z" }
 *                 path:        { type: string, example: "/api/v1/cases/external-clients/list" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     clients:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:            { type: string, format: uuid, example: "84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *                           full_name:     { type: string, example: "María López" }
 *                           phone:         { type: string, example: "987654321" }
 *                           dni:           { type: string, example: "12345678" }
 *                           email:         { type: string, nullable: true, example: "maria@example.com" }
 *                           profile_image: { type: string, nullable: true, example: "https://..." }
 *                     meta:
 *                       type: object
 *                       properties:
 *                         total:      { type: integer, example: 27 }
 *                         page:       { type: integer, example: 1 }
 *                         limit:      { type: integer, example: 10 }
 *                         totalPages: { type: integer, example: 3 }
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:   { type: string, example: "lawyer-user-id" }
 *       '400':
 *         description: "Bad Request (query inválida)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:      { type: number, example: 400 }
 *                 message:     { type: string, example: "Bad Request" }
 *                 description:
 *                   type: string
 *                   oneOf:
 *                     - type: string
 *                       example: "La página debe ser un número entero positivo"
 *                     - type: string
 *                       example: "El límite debe ser un número entero positivo"
 *                     - type: string
 *                       example: "El parámetro de búsqueda no puede estar vacío"
 *                 timestamp:   { type: string, example: "2025-09-16T19:00:00.000Z" }
 *                 path:        { type: string, example: "/api/v1/cases/external-clients/list" }
 *       '401':
 *         description: "Unauthorized (token inválido o no enviado)"
 *       '500':
 *         description: "Internal Server Error"
 */
