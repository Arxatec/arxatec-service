//src/modules/calendar/features/events/get_list/docs
/**
 * List calendar events
 * @openapi
 * /calendar/events:
 *   get:
 *     tags: [Calendar]
 *     summary: Listar eventos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start
 *         schema: { type: string, format: date-time }
 *         example: 2025-10-01T00:00:00Z
 *       - in: query
 *         name: end
 *         schema: { type: string, format: date-time }
 *         example: 2025-10-31T23:59:59Z
 *       - in: query
 *         name: case_id
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: client_id
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 message: { type: string, example: OK }
 *                 path: { type: string, example: /calendar/events }
 *                 timestamp: { type: string, format: date-time }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: string, format: uuid }
 *                       title: { type: string }
 *                       description: { type: string, nullable: true }
 *                       start_date: { type: string, format: date-time }
 *                       end_date: { type: string, format: date-time }
 *                       location: { type: string, nullable: true }
 *                       reminder_minutes: { type: integer, nullable: true }
 *                       status: { type: string, enum: [pending, confirmed, rescheduled, cancelled, done] }
 *                       case:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           id: { type: string, format: uuid }
 *                           title: { type: string }
 *                       client:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           id: { type: string, format: uuid }
 *                           name: { type: string }
 *                       lawyer:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           id: { type: string, format: uuid }
 *                           name: { type: string }
 *       '403': { description: Forbidden }
 *       '500': { description: Internal Server Error }
 */
