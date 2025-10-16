//src/modules/calendar/features/events/delete/docs/index.ts
/**
 * Delete calendar event
 * @openapi
 * /calendar/events/{id}:
 *   delete:
 *     tags: [Calendar]
 *     summary: Eliminar evento de calendario (solo abogado)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200':
 *         description: Evento eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 message: { type: string, example: Evento eliminado correctamente }
 *                 path: { type: string, example: /calendar/events/{id} }
 *                 timestamp: { type: string, format: date-time }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: string, format: uuid }
 *       '403': { description: Forbidden }
 *       '404': { description: Not Found }
 *       '500': { description: Internal Server Error }
 */
