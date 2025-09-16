// src/modules/cases/features/manage/update_case/presentation/update_case.routes.ts
import { Router } from "express";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { UpdateCaseController } from "./update_case.controller";

const router = Router();
const ctrl = new UpdateCaseController();

/**
 * Update case
 * @openapi
 * /cases/update/{id}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cases - Manage
 *     summary: "Update case"
 *     description: "Actualiza campos del caso. No se puede editar si está **archivado** o **cerrado**. Solo el cliente dueño o el abogado asignado."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del caso.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 120
 *                 example: "Revisión de contrato actualizado"
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *                 example: "Se agregaron nuevas cláusulas que requieren revisión detallada…"
 *               category_id:
 *                 type: string
 *                 format: uuid
 *                 example: "9e1b1a7f-1c2d-4a5b-9c7e-123456789abc"
 *               urgency:
 *                 type: string
 *                 enum: [baja, media, alta]
 *                 example: "alta"
 *               is_public:
 *                 type: boolean
 *                 example: true
 *               reference_code:
 *                 type: string
 *                 maxLength: 50
 *                 example: "REF-2025-045"
 *     responses:
 *       '200':
 *         description: "OK - Caso actualizado"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 200 }
 *                 message: { type: string, example: "OK" }
 *                 description: { type: string, example: "OK" }
 *                 timestamp: { type: string, example: "2025-09-16T15:40:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/update/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     case:
 *                       type: object
 *                       properties:
 *                         id: { type: string, example: "84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *                         title: { type: string, example: "Revisión de contrato actualizado" }
 *                         category_id: { type: string, example: "9e1b1a7f-1c2d-4a5b-9c7e-123456789abc" }
 *                         urgency: { type: string, example: "alta" }
 *                         is_public: { type: boolean, example: true }
 *                         reference_code: { type: string, nullable: true, example: "REF-2025-045" }
 *                     user:
 *                       type: object
 *                       properties:
 *                         id: { type: string, example: "1c2b3a4d-5e6f-7081-92a3-b4c5d6e7f809" }
 *                         role: { type: string, enum: [client, lawyer], example: "lawyer" }
 *       '400':
 *         description: "Bad Request (payload inválido o IDs inválidos)"
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
 *                       example: "El título debe tener al menos 1 carácter"
 *                     - type: string
 *                       example: "El título no puede superar los 120 caracteres"
 *                     - type: string
 *                       example: "La descripción no puede superar los 2000 caracteres"
 *                     - type: string
 *                       example: "El ID de la categoría debe tener formato UUID"
 *                     - type: string
 *                       example: "La urgencia debe ser 'baja', 'media' o 'alta'"
 *                     - type: string
 *                       example: "INVALID_ID"   # categoría inexistente
 *                 timestamp: { type: string, example: "2025-09-16T15:40:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/update/invalid" }
 *       '401':
 *         description: "Unauthorized (token inválido o no enviado)"
 *       '403':
 *         description: "Forbidden (no eres dueño/abogado asignado)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 403 }
 *                 message: { type: string, example: "Forbidden" }
 *                 description: { type: string, example: "Access denied" }
 *                 timestamp: { type: string, example: "2025-09-16T15:40:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/update/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *       '404':
 *         description: "Not Found (caso no existe)"
 *       '409':
 *         description: "Conflict (no se puede editar)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 409 }
 *                 message: { type: string, example: "Conflict" }
 *                 description:
 *                   type: string
 *                   oneOf:
 *                     - type: string
 *                       example: "CANNOT_EDIT_ARCHIVED"
 *                     - type: string
 *                       example: "CANNOT_EDIT_CLOSED"
 *                 timestamp: { type: string, example: "2025-09-16T15:40:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/update/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *       '500':
 *         description: "Internal Server Error"
 */

router.patch("/:id", authenticateToken, asyncHandler(ctrl.patch));

export { router as updateCaseRoutes };
