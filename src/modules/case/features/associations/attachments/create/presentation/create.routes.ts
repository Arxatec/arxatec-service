// src/modules/cases/features/associations/attachments/create/presentation/create.routes.ts
import { Router } from "express";
import multer from "multer";
import { asyncHandler } from "../../../../../../../middlewares/async_handler";
import { authenticateToken } from "../../../../../../../middlewares/authenticate_token";
import { CreateAttachmentController } from "./create.controller";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();
const controller = new CreateAttachmentController();

/**
 * Upload case attachment
 * @openapi
 * /cases/attachments/create/{id}:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cases - Associations - Attachments
 *     summary: "Upload attachment"
 *     description: "Sube un adjunto al caso. Solo el **cliente** dueño o el **abogado** asignado pueden hacerlo."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *         description: ID del caso.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - category_id
 *               - label
 *               - file
 *             properties:
 *               category_id:
 *                 type: string
 *                 format: uuid
 *                 example: "9e1b1a7f-1c2d-4a5b-9c7e-123456789abc"
 *               label:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 example: "Contrato firmado"
 *               description:
 *                 type: string
 *                 maxLength: 255
 *                 example: "Versión final con firmas"
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '201':
 *         description: "Attachment uploaded"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 201 }
 *                 message: { type: string, example: "Created" }
 *                 description: { type: string, example: "Attachment uploaded" }
 *                 timestamp: { type: string, example: "2025-09-16T17:30:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/attachments/create/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     attachment:
 *                       type: object
 *                       properties:
 *                         id: { type: string, format: uuid, example: "7a9f6a49-7c5a-43c7-8b1e-9c2c9b3b8e13" }
 *                         url: { type: string, example: "https://signed-url.s3.amazonaws.com/private/cases/..." }
 *                     user:
 *                       type: object
 *                       properties:
 *                         id: { type: string, example: "1c2b3a4d-5e6f-7081-92a3-b4c5d6e7f809" }
 *                         role: { type: string, enum: [client, lawyer], example: "client" }
 *       '400':
 *         description: "Bad Request (payload/archivo inválido)"
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
 *                       example: "El ID de la categoría debe tener formato UUID"
 *                     - type: string
 *                       example: "La etiqueta es obligatoria"
 *                     - type: string
 *                       example: "La etiqueta no puede superar los 100 caracteres"
 *                     - type: string
 *                       example: "La descripción no puede superar los 255 caracteres"
 *                     - type: string
 *                       example: "File is required"
 *                 timestamp: { type: string, example: "2025-09-16T17:30:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/attachments/create/invalid" }
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
 *                 timestamp: { type: string, example: "2025-09-16T17:30:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/attachments/create/84ea6..."}
 *       '404':
 *         description: "Not Found (case no encontrado)"
 *       '500':
 *         description: "Internal Server Error"
 */

router.post(
  "/:id",
  authenticateToken,
  upload.single("file"),
  asyncHandler(controller.create)
);

export { router as createAttachmentRoutes };
