// src/modules/cases/features/associations/attachments/archive/presentation/archive.routes.ts
import { Router } from "express";
import { asyncHandler } from "../../../../../../../middlewares/async_handler";
import { authenticateToken } from "../../../../../../../middlewares/authenticate_token";
import { ArchiveAttachmentController } from "./archive.controller";

const router = Router();
const controller = new ArchiveAttachmentController();

/**
 * Archive case attachment
 * @openapi
 * /cases/attachments/archive/{id}/archive/{attId}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cases - Associations - Attachments
 *     summary: "Archive attachment"
 *     description: "Archiva un adjunto de un caso. Solo el **cliente** dueño o el **abogado** asignado pueden hacerlo."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *         description: ID del caso.
 *       - in: path
 *         name: attId
 *         required: true
 *         schema: { type: string, format: uuid }
 *         description: ID del adjunto.
 *     responses:
 *       '200':
 *         description: "Attachment archived"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 200 }
 *                 message: { type: string, example: "OK" }
 *                 description: { type: string, example: "Attachment archived" }
 *                 timestamp: { type: string, example: "2025-09-16T17:10:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/attachments/archive/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29/archive/7a9f6a49-7c5a-43c7-8b1e-9c2c9b3b8e13" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     archivedAttachment:
 *                       type: object
 *                       properties:
 *                         id: { type: string, format: uuid, example: "7a9f6a49-7c5a-43c7-8b1e-9c2c9b3b8e13" }
 *                         archived: { type: boolean, example: true }
 *                     user:
 *                       type: object
 *                       properties:
 *                         id: { type: string, format: uuid, example: "1c2b3a4d-5e6f-7081-92a3-b4c5d6e7f809" }
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
 *                 description:
 *                   type: string
 *                   oneOf:
 *                     - type: string
 *                       example: "El ID del caso debe tener formato UUID"
 *                     - type: string
 *                       example: "El ID del adjunto debe tener formato UUID"
 *                 timestamp: { type: string, example: "2025-09-16T17:10:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/attachments/archive/invalid/archive/invalid" }
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
 *                 timestamp: { type: string, example: "2025-09-16T17:10:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/attachments/archive/84ea6.../archive/7a9f6..." }
 *       '404':
 *         description: "Not Found"
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
 *                       example: "Attachment not found"
 *                 timestamp: { type: string, example: "2025-09-16T17:10:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/attachments/archive/84ea6.../archive/7a9f6..." }
 *       '500':
 *         description: "Internal Server Error"
 */

router.patch(
  "/:id/archive/:attId",
  authenticateToken,
  asyncHandler(controller.archive)
);

export { router as archiveAttachmentRoutes };
