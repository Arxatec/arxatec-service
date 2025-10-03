// src/modules/lawyer/features/get_lawyers/presentation/get_lawyers.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../middlewares/authenticate_token";
import { GetLawyersController } from "./get_lawyers.controller";

const router = Router();
const ctrl = new GetLawyersController();

/**
 * Get all lawyers (clients only)
 * @openapi
 * /lawyer:
 *   get:
 *     tags:
 *       - Lawyer
 *     summary: "List lawyers with pagination and search"
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string, example: "Juan" }
 *         required: false
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, example: 1 }
 *         required: false
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, example: 10 }
 *         required: false
 *     responses:
 *       '200':
 *         description: "OK"
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         description: "Forbidden (clients only)"
 *       '500':
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/", authenticateToken, ctrl.getAll);

export { router as getLawyersRoutes };
