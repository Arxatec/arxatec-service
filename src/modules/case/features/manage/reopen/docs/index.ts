// src/modules/cases/features/manage/reopen_case/docs/index.ts
/**
 * @openapi
 * /cases/reopen/{id}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cases - Manage
 *     summary: Reopen a closed case
 *     description: Reabre un caso archived. Solo el cliente o el abogado asignado pueden hacerlo.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200': { description: Case reopened successfully }
 *       '400': { description: Bad Request }
 *       '401': { description: Unauthorized }
 *       '403': { description: Forbidden }
 *       '404': { description: Case not found }
 *       '409': { description: Conflict (case is not archived) }
 *       '500': { description: Internal Server Error }
 */
