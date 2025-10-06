// src/modules/cases/features/manage/case_detail/docs/index.ts
/**
 * @openapi
 * /cases/detail/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cases - Manage
 *     summary: Get case detail
 *     description: Devuelve el detalle de un caso si el usuario autenticado es el cliente o el abogado asignado.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: OK
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
