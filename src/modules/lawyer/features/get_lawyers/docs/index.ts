// src/modules/lawyer/features/get_lawyers/docs/index.ts
/**
 * Get all lawyers (clients only)
 * @openapi
 * /lawyer/list:
 *   get:
 *     tags:
 *       - Lawyer
 *     summary: "List lawyers with pagination and search"
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string, example: "Juan" }
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, example: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, example: 10 }
 *     responses:
 *       '200':
 *         description: "OK"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 200 }
 *                 message: { type: string, example: "OK" }
 *                 path: { type: string, example: "/api/v1/lawyer" }
 *                 timestamp: { type: string, example: "2025-09-15T20:30:00.000Z" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: string }
 *                           first_name: { type: string }
 *                           last_name: { type: string }
 *                           email: { type: string, format: email }
 *                           phone: { type: string, nullable: true }
 *                           profile_image: { type: string, nullable: true }
 *                           lawyer_details: { type: object }
 *                     meta:
 *                       type: object
 *                       properties:
 *                         totalItems: { type: integer, example: 42 }
 *                         totalPages: { type: integer, example: 5 }
 *                         currentPage: { type: integer, example: 1 }
 *                         pageSize: { type: integer, example: 10 }
 *       '401':
 *         description: "Unauthorized"
 *       '403':
 *         description: "Forbidden (clients only)"
 *       '500':
 *         description: "Server Error"
 */
