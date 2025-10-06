// src/modules/cases/features/manage/archive/docs/index.ts
/**
 * Archive case
 * @openapi
 * /cases/archive/{id}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cases - Manage
 *     summary: "Archive case"
 *     description: "Archiva un caso. Solo el **cliente** o el **abogado** participante del caso pueden archivarlo."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del caso (UUID).
 *     responses:
 *       '200':
 *         description: "Case archived"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 200 }
 *                 message: { type: string, example: "OK" }
 *                 description: { type: string, example: "Case archived" }
 *                 timestamp: { type: string, example: "2025-09-15T21:10:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/archive/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     archivedCase:
 *                       type: object
 *                       properties:
 *                         message: { type: string, example: "Case archived successfully" }
 *                     user:
 *                       type: object
 *                       properties:
 *                         id: { type: string, example: "1c2b3a4d-5e6f-7081-92a3-b4c5d6e7f809" }
 *                         role: { type: string, enum: [client, lawyer], example: "client" }
 *       '400':
 *         description: "Bad Request (validación de path param)"
 *       '401':
 *         description: "Unauthorized (token inválido o no enviado)"
 *       '403':
 *         description: "Forbidden (no eres participante del caso)"
 *       '404':
 *         description: "Not Found (caso no existe)"
 *       '409':
 *         description: "Conflict (ya estaba archivado)"
 *       '500':
 *         description: "Internal Server Error"
 */
