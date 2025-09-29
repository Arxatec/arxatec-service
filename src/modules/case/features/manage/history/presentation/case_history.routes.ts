// src/modules/cases/features/manage/history/presentation/case_history.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { GetCaseHistoryController } from "./case_history.controller";

const router = Router();
const controller = new GetCaseHistoryController();

/**
 * Get case history
 * @openapi
 * /cases/history/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cases - Manage
 *     summary: "Get case history"
 *     description: "Obtiene el historial de cambios de un caso. Solo el **cliente** o el **abogado** participante pueden acceder."
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
 *         description: "Case history retrieved"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 200 }
 *                 message: { type: string, example: "OK" }
 *                 description: { type: string, example: "Case history retrieved" }
 *                 timestamp: { type: string, example: "2025-09-16T12:00:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/history/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     history:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: string, example: "hist-01" }
 *                           field: { type: string, example: "status" }
 *                           old_value: { type: string, example: "Abierto" }
 *                           new_value: { type: string, example: "Tomado" }
 *                           created_at: { type: string, format: date-time, example: "2025-08-21T09:30:00.000Z" }
 *                     user:
 *                       type: object
 *                       properties:
 *                         id: { type: string, example: "1c2b3a4d-5e6f-7081-92a3-b4c5d6e7f809" }
 *                         role: { type: string, enum: [client, lawyer], example: "client" }
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
 *                 timestamp: { type: string, example: "2025-09-16T12:00:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/history/invalid" }
 *       '401':
 *         description: "Unauthorized (token inválido o no enviado)"
 *       '403':
 *         description: "Forbidden (no eres participante del caso)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 403 }
 *                 message: { type: string, example: "Forbidden" }
 *                 description: { type: string, example: "Access denied to this case" }
 *                 timestamp: { type: string, example: "2025-09-16T12:00:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/history/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *       '404':
 *         description: "Not Found (caso o historial no existe)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 404 }
 *                 message: { type: string, example: "Not Found" }
 *                 description:
 *                   type: string
 *                   oneOf:
 *                     - type: string
 *                       example: "Case not found"
 *                     - type: string
 *                       example: "Case history not found"
 *                 timestamp: { type: string, example: "2025-09-16T12:00:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/history/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *       '500':
 *         description: "Internal Server Error"
 */

router.get("/:id", authenticateToken, controller.getHistory);

export { router as caseHistoryRoutes };
