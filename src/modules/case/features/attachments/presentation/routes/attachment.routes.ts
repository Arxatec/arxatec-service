import { Router } from "express";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { AttachmentController } from "../controllers/attachment.controller";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();
const controller = new AttachmentController();
/**
 * @swagger
 * tags:
 *   - name: Attachments
 *     description: Manage case attachments (upload, list, archive)
 */

/**
 * @swagger
 * /cases/{id}/attachments:
 *   post:
 *     summary: Upload a new attachment
 *     description: |
 *       Sube un archivo (PDF, imagen) como adjunto a un caso.
 *       El archivo se almacena en S3 (privado) y se devuelve una URL firmada temporal.
 *       **Reglas:**
 *       - Solo el cliente creador o el abogado asignado pueden subir adjuntos.
 *       - El campo `file` es obligatorio y debe ser `multipart/form-data`.
 *     tags: [Attachments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del caso
 *         schema:
 *           type: integer
 *           example: 123
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               label:
 *                 type: string
 *                 example: "Contrato firmado"
 *               description:
 *                 type: string
 *                 example: "Adjunto de prueba"
 *               category_id:
 *                 type: integer
 *                 example: 2
 *             required:
 *               - file
 *               - label
 *               - category_id
 *     responses:
 *       201:
 *         description: Attachment uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Attachment uploaded
 *                 path:
 *                   type: string
 *                   example: /api/v1/cases/123/attachments
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-06-30T12:00:00Z"
 *                 data:
 *                   type: object
 *                   properties:
 *                     attachment:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 456
 *                         url:
 *                           type: string
 *                           example: "https://s3.amazonaws.com/bucket/private/cases/file.pdf?signature=..."
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 5
 *                         role:
 *                           type: string
 *                           enum: [client, lawyer]
 *                           example: lawyer
 *       400:
 *         description: Validation error or file missing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Case not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /cases/{id}/attachments:
 *   get:
 *     summary: List all active attachments
 *     description: |
 *       Devuelve los adjuntos activos de un caso con sus URLs firmadas.
 *       Solo el cliente creador o el abogado asignado pueden consultar.
 *     tags: [Attachments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del caso
 *         schema:
 *           type: integer
 *           example: 123
 *     responses:
 *       200:
 *         description: Attachments listed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Attachments listed
 *                 path:
 *                   type: string
 *                   example: /api/v1/cases/123/attachments
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-06-30T12:00:00Z"
 *                 data:
 *                   type: object
 *                   properties:
 *                     attachments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 456
 *                           label:
 *                             type: string
 *                             example: "Contrato firmado"
 *                           description:
 *                             type: string
 *                             example: "Adjunto de prueba"
 *                           category_id:
 *                             type: integer
 *                             example: 2
 *                           uploaded_by:
 *                             type: string
 *                             enum: [client, lawyer]
 *                             example: lawyer
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-06-30T12:00:00Z"
 *                           url:
 *                             type: string
 *                             example: "https://s3.amazonaws.com/bucket/private/cases/file.pdf?signature=..."
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 5
 *                         role:
 *                           type: string
 *                           enum: [client, lawyer]
 *                           example: client
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Case not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /cases/{id}/attachments/{attId}/archive:
 *   patch:
 *     summary: Archive an attachment
 *     description: |
 *       Archiva un adjunto de un caso.
 *       Solo el cliente creador o el abogado asignado pueden archivar.
 *     tags: [Attachments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del caso
 *         schema:
 *           type: integer
 *           example: 123
 *       - in: path
 *         name: attId
 *         required: true
 *         description: ID del adjunto
 *         schema:
 *           type: integer
 *           example: 456
 *     responses:
 *       200:
 *         description: Attachment archived successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Attachment archived
 *                 path:
 *                   type: string
 *                   example: /api/v1/cases/123/attachments/456/archive
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-06-30T12:00:00Z"
 *                 data:
 *                   type: object
 *                   properties:
 *                     archivedAttachment:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 456
 *                         archived:
 *                           type: boolean
 *                           example: true
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 5
 *                         role:
 *                           type: string
 *                           enum: [client, lawyer]
 *                           example: lawyer
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Attachment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.post(
  "/:id/attachments",
  authenticateToken,
  upload.single("file"),
  asyncHandler(controller.add)
);
router.get(
  "/:id/attachments",
  authenticateToken,
  asyncHandler(controller.list)
);
router.patch(
  "/:id/attachments/:attId/archive",
  authenticateToken,
  asyncHandler(controller.archive)
);

export { router as attachmentRoutes };
