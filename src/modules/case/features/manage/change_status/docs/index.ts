/**
 * Change case status
 * @openapi
 * /cases/status/{id}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cases - Manage
 *     summary: "Change case status"
 *     description: "Cambia el estado de un caso. Reglas de flujo: **abierto → en_progreso → cerrado**. El cliente solo puede avanzar al siguiente; el abogado puede avanzar/retroceder un paso y cerrar solo si es el abogado asignado."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *         description: ID del caso.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status_id]
 *             properties:
 *               status_id:
 *                 type: string
 *                 description: ID (o valor del enum) del nuevo estado.
 *                 example: "en_progreso"
 *               note:
 *                 type: string
 *                 maxLength: 255
 *                 example: "Cliente confirmó avance del caso."
 *     responses:
 *       '200':
 *         description: "Estado cambiado correctamente"
 *       '400':
 *         description: "Bad Request (validación/estado inválido)"
 *       '401':
 *         description: "Unauthorized"
 *       '403':
 *         description: "Forbidden (reglas de autorización/flujo)"
 *       '404':
 *         description: "Not Found (caso no existe)"
 *       '409':
 *         description: "Conflict (reglas de negocio)"
 *       '500':
 *         description: "Internal Server Error"
 */
