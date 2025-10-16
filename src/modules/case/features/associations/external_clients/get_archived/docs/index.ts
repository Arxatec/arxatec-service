// src/modules/case/features/associations/external_clients/get_archived/docs/index.ts
/**
 * Get archived external clients
 * @openapi
 * /cases/external-clients/archived:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cases - Associations - External Clients
 *     summary: "List archived external clients"
 *     description: "Devuelve los clientes externos **archiveds** del abogado autenticado."
 *     responses:
 *       '200':
 *         description: "Archived external clients"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 200 }
 *                 message: { type: string, example: "OK" }
 *                 description: { type: string, example: "Archived external clients" }
 *                 timestamp: { type: string, example: "2025-09-16T18:40:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/external-clients/archive" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     clients:
 *                       type: array
 *                       items:
 *                         type: object
 *                         additionalProperties: true
 *                         properties:
 *                           id: { type: string, format: uuid, example: "84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *                           full_name: { type: string, example: "María López" }
 *                           phone: { type: string, example: "987654321" }
 *                           dni: { type: string, example: "12345678" }
 *                           email: { type: string, nullable: true, example: "maria@example.com" }
 *                           profile_image: { type: string, nullable: true, example: "https://..." }
 *                           archived: { type: boolean, example: true }
 *                     user:
 *                       type: object
 *                       properties:
 *                         id: { type: string, example: "lawyer-user-id" }
 *       '401':
 *         description: "Unauthorized (token inválido o no enviado)"
 *       '500':
 *         description: "Internal Server Error"
 */
