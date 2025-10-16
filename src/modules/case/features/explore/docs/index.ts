// src/modules/case/features/explore_cases/docs/index.ts
/**
 * @openapi
 * /cases/explore:
 *   get:
 *     tags:
 *       - Cases - Explore
 *     summary: Explore public cases
 *     description: Lista casos públicos no archiveds con filtros y paginación.
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string, enum: [civil, laboral, familiar, penal] }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [open, in_progress, closed, archived] }
 *       - in: query
 *         name: lawyer_id
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, example: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, example: 10 }
 *     responses:
 *       '200': { description: OK }
 *       '400': { description: Bad Request }
 *       '500': { description: Internal Server Error }
 */
