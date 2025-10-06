// src/modules/cases/features/manage/history/docs/index.ts
/**
 * @openapi
 * /cases/history/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cases - Manage
 *     summary: Get case history
 *     description: Obtiene el historial de cambios de un caso. Solo el cliente o el abogado participante pueden acceder.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: Case history retrieved
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Not Found
 *       '500':
 *         description: Internal Server Error
 */
