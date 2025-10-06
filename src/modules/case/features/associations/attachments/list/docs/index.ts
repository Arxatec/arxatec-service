// src/modules/cases/features/associations/attachments/list/docs/index.ts
/**
 * List case attachments
 * @openapi
 * /cases/attachments/list/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cases - Associations - Attachments
 *     summary: "List attachments of a case"
 *     description: "Lista adjuntos del caso. Solo el **cliente** dueño o el **abogado** asignado."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *         description: ID del caso.
 *       - in: query
 *         name: page
 *         required: false
 *         schema: { type: integer, minimum: 1, example: 1 }
 *         description: Número de página.
 *       - in: query
 *         name: limit
 *         required: false
 *         schema: { type: integer, minimum: 1, maximum: 100, example: 10 }
 *         description: Tamaño de página (máx. 100).
 *     responses:
 *       '200':
 *         description: "Attachments listed"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 200 }
 *                 message: { type: string, example: "OK" }
 *                 description: { type: string, example: "Attachments listed" }
 *                 timestamp: { type: string, example: "2025-09-16T18:00:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/attachments/list/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     attachments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: string, format: uuid, example: "7a9f6a49-7c5a-43c7-8b1e-9c2c9b3b8e13" }
 *                           label: { type: string, example: "Contrato firmado" }
 *                           description: { type: string, nullable: true, example: "Versión final" }
 *                           category_id: { type: string, format: uuid, example: "9e1b1a7f-1c2d-4a5b-9c7e-123456789abc" }
 *                           uploaded_by: { type: string, enum: [client, lawyer], example: "client" }
 *                           created_at: { type: string, format: date-time, example: "2025-08-25T12:00:00.000Z" }
 *                           url: { type: string, example: "https://signed-url.s3.amazonaws.com/private/cases/..." }
 *                     meta:
 *                       type: object
 *                       properties:
 *                         total: { type: integer, example: 12 }
 *                         page: { type: integer, example: 1 }
 *                         limit: { type: integer, example: 10 }
 *                         totalPages: { type: integer, example: 2 }
 *                     user:
 *                       type: object
 *                       properties:
 *                         id: { type: string, example: "1c2b3a4d-5e6f-7081-92a3-b4c5d6e7f809" }
 *                         role: { type: string, enum: [client, lawyer], example: "lawyer" }
 *       '400':
 *         description: "Bad Request (UUID o query inválida)"
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
 *                       example: "El ID del caso debe tener formato UUID"
 *                     - type: string
 *                       example: "La página debe ser un número entero"
 *                     - type: string
 *                       example: "El límite máximo permitido es 100"
 *                 timestamp: { type: string, example: "2025-09-16T18:00:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/attachments/list/invalid" }
 *       '401':
 *         description: "Unauthorized (token inválido o no enviado)"
 *       '403':
 *         description: "Forbidden (no eres participante del caso)"
 *       '404':
 *         description: "Not Found (caso no existe)"
 *       '500':
 *         description: "Internal Server Error"
 */
