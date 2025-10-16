/**
 * @openapi
 * /calendar/events/{id}:
 *   get:
 *     tags: [Calendar]
 *     summary: Obtener detalle de un evento
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: c5b82e9b-1a23-4c56-9d78-0ab12c34de56
 *     responses:
 *       '200':
 *         description: Detalle del evento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 message: { type: string, example: Detalle obtenido correctamente }
 *                 path: { type: string, example: /calendar/events/c5b82e9b-1a23-4c56-9d78-0ab12c34de56 }
 *                 timestamp: { type: string, format: date-time }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: string, format: uuid }
 *                     title: { type: string }
 *                     description: { type: string, nullable: true }
 *                     startDate: { type: string, format: date-time }
 *                     endDate: { type: string, format: date-time }
 *                     location: { type: string, nullable: true }
 *                     reminderMinutes: { type: integer, nullable: true }
 *                     status: { type: string, enum: [pending, confirmed, rescheduled, cancelled, done] }
 *                     case:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id: { type: string, format: uuid }
 *                         title: { type: string }
 *                     client:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id: { type: string, format: uuid }
 *                         name: { type: string }
 *       '403': { description: Forbidden }
 *       '404': { description: Not Found }
 *       '500': { description: Internal Server Error }
 */
