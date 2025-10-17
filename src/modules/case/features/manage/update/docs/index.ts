// src/modules/cases/features/manage/update_case/docs/index.ts
/**
 * @openapi
 * /cases/{id}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cases - Manage
 *     summary: Update case
 *     description: >
 *       Actualiza un caso. `is_public` y `status` se derivan por reglas.
 *       Cliente puede asignar abogado solo si el caso está público y sin abogado (pasa a privado y `in_progress`).
 *       Cliente no puede cambiar `external_client_id`. Abogado no puede cambiar `selected_lawyer_id`.
 *       Abogado puede cambiar `external_client_id` a uno propio (no archived).
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
 *             properties:
 *               title: { type: string, minLength: 5, maxLength: 120 }
 *               description: { type: string, minLength: 20, maxLength: 2000 }
 *               category: { type: string, enum: [civil, labor, family, criminal] }
 *               urgency: { type: string, enum: [high, medium, low] }
 *               reference_code: { type: string, maxLength: 50 }
 *               selected_lawyer_id: { type: string, format: uuid, description: "Solo CLIENTE; público→privado y `in_progress` si no tiene abogado." }
 *               external_client_id: { type: string, format: uuid, description: "Solo ABOGADO; debe pertenecerle y no estar archived." }
 *     responses:
 *       '200': { description: Case updated }
 *       '400': { description: Bad Request }
 *       '401': { description: Unauthorized }
 *       '403': { description: Forbidden }
 *       '404': { description: Not Found }
 *       '409': { description: Conflict }
 *       '500': { description: Internal Server Error }
 */
