//src/modules/calendar/features/events/update_hour/docs/index.ts
/**
 * Update event time
 * @openapi
 * /calendar/events/{id}/time:
 *   patch:
 *     tags: [Calendar]
 *     summary: Actualizar hora del evento (solo abogado)
 *     security:
 *       - bearerAuth: []
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
 *             required: [start_date, end_date]
 *             properties:
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-10-13T09:00:00Z
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-10-13T10:30:00Z
 *     responses:
 *       '200':
 *         description: Hora actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 message: { type: string, example: Hora actualizada correctamente }
 *                 path: { type: string, example: /calendar/events/{id}/time }
 *                 timestamp: { type: string, format: date-time }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: string, format: uuid }
 *       '403': { description: Forbidden }
 *       '404': { description: Not Found }
 *       '500': { description: Internal Server Error }
 */
