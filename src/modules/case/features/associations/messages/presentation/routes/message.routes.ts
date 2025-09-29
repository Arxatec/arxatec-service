import { Router } from "express";
import { authenticateToken } from "../../../../../../../middlewares/authenticate_token";
import { MessageController } from "../controllers/message.controller";

const router = Router();
const controller = new MessageController();

/**
 * @swagger
 * /cases/{id}/messages:
 *   post:
 *     summary: Send a message in a case
 *     description: |
 *       Permite enviar un mensaje interno dentro de un caso.
 *       - Solo el cliente creador o el abogado asignado pueden enviar mensajes.
 *       - El caso no puede estar archivado.
 *       - Debe haber un abogado asignado al caso.
 *       - Al enviar, se crea una notificación y se emite un evento WebSocket.
 *     tags: [Cases]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del caso
 *         example: 123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 2000
 *                 example: "Hola abogado, ¿cómo avanza el proceso?"
 *             required:
 *               - content
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Message sent successfully
 *                 path:
 *                   type: string
 *                   example: /api/v1/cases/123/messages
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-06-30T16:00:00Z"
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 555
 *                         service_id:
 *                           type: integer
 *                           example: 321
 *                         content:
 *                           type: string
 *                           example: "Hola abogado, ¿cómo avanza el proceso?"
 *                         sent_by:
 *                           type: string
 *                           enum: [client, lawyer]
 *                           example: client
 *                         is_read:
 *                           type: boolean
 *                           example: false
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-06-30T16:00:00Z"
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 5
 *                         role:
 *                           type: string
 *                           enum: [client, lawyer]
 *                           example: client
 *       400:
 *         description: Validation error
 *       403:
 *         description: Access denied or case restrictions
 *       404:
 *         description: Case not found
 *       409:
 *         description: Conflict (e.g., case archived)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/:id/messages", authenticateToken, controller.send);

/**
 * @swagger
 * /cases/{id}/messages/history:
 *   get:
 *     summary: Get message history for a case
 *     description: |
 *       Obtiene el historial de mensajes de un caso.
 *       - Solo el cliente creador o el abogado asignado pueden acceder al historial de mensajes.
 *       - El caso no puede estar archivado.
 *     tags: [Cases]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del caso
 *         schema:
 *           type: integer
 *         example: 123
 *     responses:
 *       200:
 *         description: Message history fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Messages fetched successfully"
 *                 path:
 *                   type: string
 *                   example: /api/v1/cases/123/messages/history
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-06-30T16:00:00Z"
 *                 data:
 *                   type: object
 *                   properties:
 *                     messages:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 555
 *                           service_id:
 *                             type: integer
 *                             example: 321
 *                           content:
 *                             type: string
 *                             example: "Hola abogado, ¿cómo avanza el proceso?"
 *                           sent_by:
 *                             type: string
 *                             enum: [client, lawyer]
 *                             example: client
 *                           is_read:
 *                             type: boolean
 *                             example: false
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-06-30T16:00:00Z"
 *       400:
 *         description: Validation error
 *       403:
 *         description: Access denied
 *       404:
 *         description: Case not found
 */
router.get("/:id/messages/history", authenticateToken, controller.getHistory);

export { router as messageRoutes };
