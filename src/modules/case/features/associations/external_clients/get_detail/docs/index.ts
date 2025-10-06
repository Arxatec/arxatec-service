// src/modules/case/features/associations/external_clients/get_detail/docs/index.ts
/**
 * Get external client detail
 * @openapi
 * /cases/external-clients/detail/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cases - Associations - External Clients
 *     summary: "Get external client detail"
 *     description: "Devuelve el detalle de un **cliente externo** perteneciente al abogado autenticado."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *         description: ID del cliente externo.
 *     responses:
 *       '200':
 *         description: "External client detail"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 200 }
 *                 message: { type: string, example: "OK" }
 *                 description: { type: string, example: "External client detail" }
 *                 timestamp: { type: string, example: "2025-09-16T18:50:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/external-clients/detail/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     client:
 *                       type: object
 *                       properties:
 *                         id: { type: string, format: uuid, example: "84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *                         full_name: { type: string, example: "María López" }
 *                         phone: { type: string, example: "987654321" }
 *                         dni: { type: string, example: "12345678" }
 *                         email: { type: string, nullable: true, example: "maria@example.com" }
 *                         profile_image: { type: string, nullable: true, example: "https://..." }
 *                         archived: { type: boolean, example: false }
 *                     user:
 *                       type: object
 *                       properties:
 *                         id: { type: string, example: "lawyer-user-id" }
 *       '400':
 *         description: "Bad Request (UUID inválido)"
 *       '401':
 *         description: "Unauthorized (token inválido o no enviado)"
 *       '404':
 *         description: "Not Found (no existe o no pertenece al abogado)"
 *       '500':
 *         description: "Internal Server Error"
 */
