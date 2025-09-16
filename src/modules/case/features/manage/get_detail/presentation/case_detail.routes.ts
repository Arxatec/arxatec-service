// src/modules/cases/features/manage/case_detail/presentation/case_detail.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { CaseDetailController } from "./case_detail.controller";

const router = Router();
const controller = new CaseDetailController();

/**
 * Get case detail
 * @openapi
 * /cases/detail/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cases - Manage
 *     summary: "Get case detail"
 *     description: "Devuelve el detalle de un caso si el usuario autenticado es el **cliente** o el **abogado** asignado."
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
 *         description: "OK"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 200 }
 *                 message: { type: string, example: "OK" }
 *                 description: { type: string, example: "OK" }
 *                 timestamp: { type: string, example: "2025-09-15T22:05:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/detail/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     case:
 *                       type: object
 *                       properties:
 *                         id: { type: string, example: "84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *                         title: { type: string, example: "Consulta por contrato" }
 *                         description: { type: string, example: "Necesito revisar un contrato de arrendamiento..." }
 *                         category:
 *                           type: object
 *                           properties:
 *                             id: { type: string, example: "9e1b1a7f-1c2d-4a5b-9c7e-123456789abc" }
 *                             name: { type: string, example: "Contratos" }
 *                         status:
 *                           type: object
 *                           properties:
 *                             id: { type: string, example: "7a9f6a49-7c5a-43c7-8b1e-9c2c9b3b8e13" }
 *                             name: { type: string, example: "Tomado" }
 *                         urgency: { type: string, example: "media" }
 *                         is_public: { type: boolean, example: true }
 *                         created_at: { type: string, example: "2025-08-20T10:00:00.000Z" }
 *                         service:
 *                           type: object
 *                           properties:
 *                             id: { type: string, example: "2b1c3d4e-5f60-4718-9abc-1234567890ab" }
 *                             lawyer_id: { type: string, nullable: true, example: "1c2b3a4d-5e6f-7081-92a3-b4c5d6e7f809" }
 *                             client_id: { type: string, example: "5f60e471-9abc-1234-90ab-2b1c3d4e5f60" }
 *                             external_client_id: { type: string, nullable: true, example: null }
 *                         attachments:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id: { type: string, example: "att-01" }
 *                               label: { type: string, example: "DNI escaneado" }
 *                               category_id: { type: string, example: "cat-attach-01" }
 *                               uploaded_by: { type: string, example: "client" }
 *                               created_at: { type: string, example: "2025-08-20T11:00:00.000Z" }
 *                         histories:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id: { type: string, example: "hist-01" }
 *                               field: { type: string, example: "status" }
 *                               old_value: { type: string, example: "Abierto" }
 *                               new_value: { type: string, example: "Tomado" }
 *                               created_at: { type: string, example: "2025-08-21T09:30:00.000Z" }
 *                     user:
 *                       type: object
 *                       properties:
 *                         id: { type: string, example: "1c2b3a4d-5e6f-7081-92a3-b4c5d6e7f809" }
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
 *                 timestamp: { type: string, example: "2025-09-15T22:05:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/detail/invalid" }
 *       '401':
 *         description: "Unauthorized (token inválido o no enviado)"
 *       '403':
 *         description: "Forbidden (no eres dueño/abogado del caso)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 403 }
 *                 message: { type: string, example: "Forbidden" }
 *                 description: { type: string, example: "Access denied to this case" }
 *                 timestamp: { type: string, example: "2025-09-15T22:05:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/detail/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
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
 *                 timestamp: { type: string, example: "2025-09-15T22:05:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/detail/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *       '500':
 *         description: "Internal Server Error"
 */

router.get("/:id", authenticateToken, asyncHandler(controller.get));

export { router as caseDetailRoutes };
