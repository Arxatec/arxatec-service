// src/modules/cases/features/manage/reopen/presentation/reopen_case.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { ReopenCaseController } from "./reopen_case.controller";

const router = Router();
const controller = new ReopenCaseController();

/**
 * Reopen case
 * @openapi
 * /cases/reopen/{id}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cases - Manage
 *     summary: "Reopen a closed case"
 *     description: "Permite reabrir un caso previamente archivado. Solo el cliente o el abogado asignado pueden realizar esta acción."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del caso.
 *     responses:
 *       '200':
 *         description: "Case reopened successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 200 }
 *                 message: { type: string, example: "OK" }
 *                 description: { type: string, example: "Case reopened" }
 *                 timestamp: { type: string, example: "2025-09-16T15:00:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/reopen/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     case:
 *                       type: object
 *                       properties:
 *                         id: { type: string, example: "84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *                         archived: { type: boolean, example: false }
 *                     user:
 *                       type: object
 *                       properties:
 *                         id: { type: string, example: "user-123" }
 *                         role: { type: string, enum: [client, lawyer], example: "lawyer" }
 *       '400':
 *         description: "Bad Request (UUID inválido)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 400 }
 *                 message: { type: string, example: "Bad Request" }
 *                 description: { type: string, example: "El ID del caso debe tener formato UUID" }
 *                 timestamp: { type: string, example: "2025-09-16T15:00:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/reopen/invalid" }
 *       '401':
 *         description: "Unauthorized (token inválido o no enviado)"
 *       '403':
 *         description: "Forbidden (usuario no es participante del caso)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 403 }
 *                 message: { type: string, example: "Forbidden" }
 *                 description: { type: string, example: "Access denied" }
 *                 timestamp: { type: string, example: "2025-09-16T15:00:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/reopen/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *       '404':
 *         description: "Case not found"
 *       '409':
 *         description: "Conflict (case is not archived)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 409 }
 *                 message: { type: string, example: "Conflict" }
 *                 description: { type: string, example: "ONLY_ARCHIVED_CASES_CAN_BE_REOPENED" }
 *                 timestamp: { type: string, example: "2025-09-16T15:00:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/reopen/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *       '500':
 *         description: "Internal Server Error"
 */

router.patch("/:id", authenticateToken, controller.reopen);

export { router as reopenCaseRoutes };
