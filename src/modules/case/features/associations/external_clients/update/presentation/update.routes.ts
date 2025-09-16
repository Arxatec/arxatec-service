// src/modules/case/features/associations/external_clients/update/presentation/update.routes.ts
import { Router, Request } from "express";
import multer from "multer";
import { authenticateToken } from "../../../../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../../../../middlewares/async_handler";
import { UpdateExternalClientController } from "./update.controller";

const router = Router();
const ctrl = new UpdateExternalClientController();

const imageMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];
const fileFilter = (
  _: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) =>
  imageMimeTypes.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("ONLY_IMAGE_FILES_ALLOWED"));
const upload = multer({ storage: multer.memoryStorage(), fileFilter });

/**
 * Update external client
 * @openapi
 * /cases/external-clients/update/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cases - Associations - External Clients
 *     summary: "Update external client"
 *     description: "Actualiza los datos de un **cliente externo** del abogado autenticado. Puede incluir un nuevo avatar (opcional)."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *         description: ID del cliente externo.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 120
 *                 example: "María López"
 *               phone:
 *                 type: string
 *                 minLength: 7
 *                 maxLength: 15
 *                 example: "987654321"
 *               dni:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 8
 *                 example: "12345678"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "maria@example.com"
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: "Imagen (jpeg, jpg, png, webp o gif). Opcional."
 *     responses:
 *       '200':
 *         description: "External client updated"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:      { type: number, example: 200 }
 *                 message:     { type: string, example: "OK" }
 *                 description: { type: string, example: "External client updated" }
 *                 timestamp:   { type: string, example: "2025-09-16T19:10:00.000Z" }
 *                 path:        { type: string, example: "/api/v1/cases/external-clients/update/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     client:
 *                       type: object
 *                       properties:
 *                         id: { type: string, format: uuid, example: "84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *                         message: { type: string, example: "EXTERNAL_CLIENT_UPDATED" }
 *                     user:
 *                       type: object
 *                       properties:
 *                         id: { type: string, example: "lawyer-user-id" }
 *       '400':
 *         description: "Bad Request (validación o tipo de archivo inválido)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:      { type: number, example: 400 }
 *                 message:     { type: string, example: "Bad Request" }
 *                 description:
 *                   type: string
 *                   oneOf:
 *                     - type: string
 *                       example: "El nombre completo debe tener al menos 2 caracteres"
 *                     - type: string
 *                       example: "El teléfono debe tener al menos 7 dígitos"
 *                     - type: string
 *                       example: "El DNI debe tener exactamente 8 dígitos"
 *                     - type: string
 *                       example: "El formato del correo electrónico no es válido"
 *                     - type: string
 *                       example: "ONLY_IMAGE_FILES_ALLOWED"
 *                 timestamp:   { type: string, example: "2025-09-16T19:10:00.000Z" }
 *                 path:        { type: string, example: "/api/v1/cases/external-clients/update/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *       '401':
 *         description: "Unauthorized (token inválido o no enviado)"
 *       '404':
 *         description: "Not Found (no existe o no pertenece al abogado)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:      { type: number, example: 404 }
 *                 message:     { type: string, example: "Not Found" }
 *                 description: { type: string, example: "EXTERNAL_CLIENT_NOT_FOUND" }
 *                 timestamp:   { type: string, example: "2025-09-16T19:10:00.000Z" }
 *                 path:        { type: string, example: "/api/v1/cases/external-clients/update/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *       '500':
 *         description: "Internal Server Error"
 */

router.put(
  "/:id",
  authenticateToken,
  upload.single("avatar"),
  asyncHandler((req, res) => ctrl.updateExternalClient(req, res))
);

export default router;
