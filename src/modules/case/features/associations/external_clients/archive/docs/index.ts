// src/modules/case/features/associations/external_clients/archive/docs/index.ts
/**
 * Archive external client
 * @openapi
 * /cases/external-clients/archive/{id}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cases - Associations - External Clients
 *     summary: "Archive external client"
 *     description: "Archiva un cliente externo asociado al abogado autenticado."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *         description: ID del cliente externo.
 *     responses:
 *       '200':
 *         description: "External client archived"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 200 }
 *                 message: { type: string, example: "OK" }
 *                 description: { type: string, example: "External client archived" }
 *                 timestamp: { type: string, example: "2025-09-16T18:20:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/external-clients/archive/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     client:
 *                       type: object
 *                       properties:
 *                         id: { type: string, format: uuid, example: "84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *                         message: { type: string, example: "Cliente externo archivado exitosamente" }
 *                     user:
 *                       type: object
 *                       properties:
 *                         id: { type: string, example: "lawyer-user-id" }
 *       '400':
 *         description: "Bad Request (UUID inválido)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 400 }
 *                 message: { type: string, example: "Bad Request" }
 *                 description: { type: string, example: "El ID del cliente externo debe tener formato UUID" }
 *                 timestamp: { type: string, example: "2025-09-16T18:20:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/external-clients/archive/invalid" }
 *       '401':
 *         description: "Unauthorized (token inválido o no enviado)"
 *       '404':
 *         description: "Not Found (no existe o no pertenece al abogado)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 404 }
 *                 message: { type: string, example: "Not Found" }
 *                 description: { type: string, example: "Cliente externo no encontrado" }
 *                 timestamp: { type: string, example: "2025-09-16T18:20:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/external-clients/archive/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *       '500':
 *         description: "Internal Server Error"
 */
