// src/modules/case/features/messages/docs/index.ts
/**
 * @openapi
 * /cases/associations/messages/{id}:
 *   post:
 *     summary: Send a message in a case
 *     tags: [Cases]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content: { type: string, minLength: 1, maxLength: 2000 }
 *     responses:
 *       201: { description: Message sent successfully }
 *
 * /cases/associations/messages/{id}/history:
 *   get:
 *     summary: Get message history for a case
 *     tags: [Cases]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Message history fetched successfully }
 */
