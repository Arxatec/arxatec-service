// src/modules/case/features/associations/external_clients/create/presentation/create.routes.ts
import { Router, Request } from "express";
import multer from "multer";
import { authenticateToken } from "../../../../../../../middlewares/authenticate_token";
import { CreateExternalClientController } from "./create.controller";

const router = Router();
const ctrl = new CreateExternalClientController();

const imageMimeTypes = ["image/jpeg", "image/jpg", "image/png"];
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
 * Create external client
 * @openapi
 * /cases/external-clients/create:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cases - Associations - External Clients
 *     summary: "Create external client"
 *     description: "Crea un cliente externo asociado al abogado autenticado. El avatar es opcional."
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - phone
 *               - dni
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
 *                 nullable: true
 *                 example: "maria@example.com"
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: "Imagen (jpeg, jpg, png, webp o gif). Opcional."
 *     responses:
 *       '201':
 *         description: "External client created"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 201 }
 *                 message: { type: string, example: "Created" }
 *                 description: { type: string, example: "External client created" }
 *                 timestamp: { type: string, example: "2025-09-16T18:30:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/external-clients/create" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     client:
 *                       type: object
 *                       properties:
 *                         id: { type: string, format: uuid, example: "84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *                         message: { type: string, example: "Cliente externo creado exitosamente" }
 *                     user:
 *                       type: object
 *                       properties:
 *                         id: { type: string, example: "lawyer-user-id" }
 *       '400':
 *         description: "Bad Request (validación o archivo inválido)"
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
 *                       example: "El nombre completo debe tener al menos 2 caracteres"
 *                     - type: string
 *                       example: "El teléfono debe tener al menos 7 dígitos"
 *                     - type: string
 *                       example: "El DNI debe tener exactamente 8 dígitos"
 *                     - type: string
 *                       example: "El formato del correo electrónico no es válido"
 *                     - type: string
 *                       example: "ONLY_IMAGE_FILES_ALLOWED"
 *                 timestamp: { type: string, example: "2025-09-16T18:30:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/external-clients/create" }
 *       '401':
 *         description: "Unauthorized (token inválido o no enviado)"
 *       '500':
 *         description: "Internal Server Error"
 */

router.post(
  "/",
  authenticateToken,
  upload.single("avatar"),
  ctrl.createExternalClient
);

export default router;
