/**
 * @openapi
 * /calendar/events/{id}:
 *   put:
 *     tags: [Calendar]
 *     summary: Actualizar un evento (solo abogados)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *         example: c5b82e9b-1a23-4c56-9d78-0ab12c34de56
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string, minLength: 3, maxLength: 150 }
 *               description: { type: string, maxLength: 2000 }
 *               start_date: { type: string, format: date-time }
 *               end_date: { type: string, format: date-time }
 *               location: { type: string, maxLength: 150 }
 *               reminder_minutes: { type: integer }
 *               status: { type: string, enum: [pending, confirmed, rescheduled, cancelled, done] }
 *               case_id: { type: string, format: uuid, nullable: true }
 *               client_id: { type: string, format: uuid, nullable: true }
 *           examples:
 *             fullUpdate:
 *               value:
 *                 title: Audiencia reprogramada
 *                 description: Cambio por agenda del juzgado
 *                 start_date: 2025-10-13T09:00:00Z
 *                 end_date: 2025-10-13T10:30:00Z
 *                 status: rescheduled
 *                 location: Juzgado criminal Lima
 *                 reminder_minutes: 45
 *     responses:
 *       '200':
 *         description: Evento actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 message: { type: string, example: Evento actualizado correctamente }
 *                 path: { type: string, example: /calendar/events/c5b82e9b-1a23-4c56-9d78-0ab12c34de56 }
 *                 timestamp: { type: string, format: date-time }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: string, format: uuid }
 *       '400': { description: Bad Request }
 *       '403': { description: Forbidden }
 *       '404': { description: Not Found }
 *       '500': { description: Internal Server Error }
 */
