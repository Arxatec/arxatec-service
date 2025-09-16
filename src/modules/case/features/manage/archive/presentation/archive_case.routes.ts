// src/modules/cases/features/manage/archive/presentation/archive_case.routes.ts
import { Router } from "express";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { ArchiveCaseController } from "./archive_case.controller";

const controller = new ArchiveCaseController();
const router = Router();

/**
 * Archive case
 * @openapi
 * /cases/archive/{id}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cases - Manage
 *     summary: "Archive case"
 *     description: "Archiva un caso. Solo el **cliente** o el **abogado** participante del caso pueden archivarlo."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del caso (UUID).
 *     responses:
 *       '200':
 *         description: "Case archived"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "OK"
 *                 description:
 *                   type: string
 *                   example: "Case archived"
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T21:10:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/cases/archive/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29"
 *                 data:
 *                   type: object
 *                   properties:
 *                     archivedCase:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                           example: "Case archived successfully"
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "1c2b3a4d-5e6f-7081-92a3-b4c5d6e7f809"
 *                         role:
 *                           type: string
 *                           enum: [client, lawyer]
 *                           example: "client"
 *       '400':
 *         description: "Bad Request (validación de path param)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 400 }
 *                 message: { type: string, example: "Bad Request" }
 *                 description:
 *                   type: string
 *                   oneOf:
 *                     - type: string
 *                       example: "El ID del caso es obligatorio"
 *                     - type: string
 *                       example: "El ID del caso debe tener formato UUID"
 *                 timestamp: { type: string, example: "2025-09-15T21:10:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/archive/invalid" }
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
 *                 timestamp: { type: string, example: "2025-09-15T21:10:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/archive/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *       '404':
 *         description: "Not Found (caso no existe)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 404 }
 *                 message: { type: string, example: "Not Found" }
 *                 description: { type: string, example: "Case not found" }
 *                 timestamp: { type: string, example: "2025-09-15T21:10:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/archive/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *       '409':
 *         description: "Conflict (ya estaba archivado)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 409 }
 *                 message: { type: string, example: "Conflict" }
 *                 description: { type: string, example: "Case already archived" }
 *                 timestamp: { type: string, example: "2025-09-15T21:10:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/archive/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *       '500':
 *         description: "Internal Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 500 }
 *                 message: { type: string, example: "Internal Server Error" }
 *                 description: { type: string, example: "Unexpected server error" }
 *                 timestamp: { type: string, example: "2025-09-15T21:10:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/archive/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 */

router.patch("/:id", authenticateToken, asyncHandler(controller.archive));

export { router as archiveCaseRoutes };
