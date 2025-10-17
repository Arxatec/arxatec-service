/**
 * Create calendar event
 * @openapi
 * /calendar/events:
 *   post:
 *     tags: [Calendar]
 *     summary: Crear evento de calendario (solo abogados)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, start_date, end_date]
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 150
 *                 example: Audiencia preliminar
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *                 example: Audiencia del caso de fraude fiscal
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-10-12T09:00:00Z
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-10-12T10:00:00Z
 *               location:
 *                 type: string
 *                 example: Juzgado criminal Lima
 *               reminder_minutes:
 *                 type: integer
 *                 example: 30
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, rescheduled, cancelled, done]
 *               case_id:
 *                 type: string
 *                 format: uuid
 *                 example: 64fd1e0b-3d2a-4b11-9a77-1d2b3c4e5f60
 *               client_id:
 *                 type: string
 *                 format: uuid
 *                 example: 78ae29fb-c2a1-4d3b-9c55-2f1a0b9c8d77
 *     responses:
 *       '201':
 *         description: Evento creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 201 }
 *                 message: { type: string, example: Evento creado correctamente }
 *                 path: { type: string, example: /calendar/events }
 *                 timestamp: { type: string, format: date-time }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: string, format: uuid, example: c5b82e9b-1a23-4c56-9d78-0ab12c34de56 }
 *       '400': { description: Bad Request }
 *       '403': { description: Forbidden }
 *       '500': { description: Internal Server Error }
 */
