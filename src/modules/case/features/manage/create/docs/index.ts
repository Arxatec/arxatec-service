// src/modules/cases/features/manage/create_case/docs/index.ts
/**
 * @openapi
 * /cases/create:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cases - Manage
 *     summary: Create case
 *     description: >
 *       Crea un caso. No envíes `is_public` ni `status`: se derivan por reglas.
 *       Reglas:
 *       - Cliente:
 *         - Sin `selected_lawyer_id` → público y estado `open`.
 *         - Con `selected_lawyer_id` → privado y estado `in_progress`.
 *       - Abogado:
 *         - Requiere `external_client_id` propio (no archived) → privado y estado `in_progress`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, category]
 *             properties:
 *               service_id:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 120
 *               description:
 *                 type: string
 *                 minLength: 20
 *                 maxLength: 2000
 *               category:
 *                 type: string
 *                 enum: [civil, labor, family, criminal]
 *               urgency:
 *                 type: string
 *                 enum: [high, medium, low]
 *                 default: medium
 *               reference_code:
 *                 type: string
 *                 maxLength: 50
 *                 nullable: true
 *               selected_lawyer_id:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *               external_client_id:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *     responses:
 *       '201':
 *         description: Case created
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Internal Server Error
 */
