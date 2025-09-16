// src/modules/cases/features/create_case/presentation/routes/create_case.routes.ts
import { Router } from "express";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { CreateCaseController } from "./create_case.controller";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";

const router = Router();
const controller = new CreateCaseController();

/**
 * Create case
 * @openapi
 * /cases/create:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cases - Manage
 *     summary: "Create case"
 *     description: |
 *       Crea un caso. Reglas:
 *       - Si el **cliente** crea: se valida capacidad del cliente y el estado inicial será **open** (statuses[0]), salvo que envíe `selected_lawyer_id` → pasa a **taken** (statuses[1]).
 *       - Si el **abogado** crea:
 *         - Se valida capacidad del abogado para “tomar”.
 *         - Si `is_public` es **false**, el abogado queda asignado.
 *       - Si se envía `external_client_id`, debe pertenecer al abogado autenticado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category_id
 *             properties:
 *               service_id:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: "Opcional. UUID de un servicio existente."
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 120
 *                 example: "Asesoría sobre contrato de arrendamiento"
 *               description:
 *                 type: string
 *                 minLength: 20
 *                 maxLength: 2000
 *                 example: "Necesito revisar un contrato de arrendamiento con cláusulas específicas..."
 *               category_id:
 *                 type: string
 *                 format: uuid
 *                 example: "9e1b1a7f-1c2d-4a5b-9c7e-123456789abc"
 *               urgency:
 *                 type: string
 *                 enum: [alta, media, baja]
 *                 default: media
 *                 example: "media"
 *               status_id:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *               is_public:
 *                 type: boolean
 *                 default: true
 *               reference_code:
 *                 type: string
 *                 maxLength: 50
 *                 nullable: true
 *                 example: "REF-2025-001"
 *               selected_lawyer_id:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *               external_client_id:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *     responses:
 *       '201':
 *         description: "Case created"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 201 }
 *                 message: { type: string, example: "Created" }
 *                 description: { type: string, example: "Case created successfully" }
 *                 timestamp: { type: string, example: "2025-09-15T21:40:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/create" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     case:
 *                       type: object
 *                       properties:
 *                         id: { type: string, example: "84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *                         service_id: { type: string, example: "2b1c3d4e-5f60-4718-9abc-1234567890ab" }
 *                         title: { type: string, example: "Asesoría sobre contrato de arrendamiento" }
 *                         description: { type: string, example: "Necesito revisar un contrato..." }
 *                         category_id: { type: string, example: "9e1b1a7f-1c2d-4a5b-9c7e-123456789abc" }
 *                         status_id: { type: string, example: "7a9f6a49-7c5a-43c7-8b1e-9c2c9b3b8e13" }
 *                         urgency: { type: string, example: "media" }
 *                         is_public: { type: boolean, example: true }
 *                         reference_code: { type: string, nullable: true, example: "REF-2025-001" }
 *                     user:
 *                       type: object
 *                       properties:
 *                         id: { type: string, example: "1c2b3a4d-5e6f-7081-92a3-b4c5d6e7f809" }
 *                         role: { type: string, enum: [client, lawyer], example: "client" }
 *       '400':
 *         description: "Bad Request (validación de payload)"
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
 *                       example: "El título es obligatorio"
 *                     - type: string
 *                       example: "El título debe tener al menos 5 caracteres"
 *                     - type: string
 *                       example: "La descripción es obligatoria"
 *                     - type: string
 *                       example: "La descripción debe tener al menos 20 caracteres"
 *                     - type: string
 *                       example: "El ID de la categoría es obligatorio"
 *                     - type: string
 *                       example: "El ID de la categoría debe tener formato UUID"
 *                     - type: string
 *                       example: "La urgencia debe ser 'alta', 'media' o 'baja'"
 *                     - type: string
 *                       example: "El ID del servicio debe tener formato UUID"
 *                     - type: string
 *                       example: "El ID del estado debe tener formato UUID"
 *                     - type: string
 *                       example: "El ID del abogado debe tener formato UUID"
 *                     - type: string
 *                       example: "El ID del cliente externo debe tener formato UUID"
 *                 timestamp: { type: string, example: "2025-09-15T21:40:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/create" }
 *       '401':
 *         description: "Unauthorized (token inválido o no enviado)"
 *       '403':
 *         description: "Forbidden (políticas de capacidad o cliente externo ajeno al abogado)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 403 }
 *                 message: { type: string, example: "Forbidden" }
 *                 description:
 *                   type: string
 *                   oneOf:
 *                     - type: string
 *                       example: "EXTERNAL_CLIENT_NOT_FOUND"
 *                     - type: string
 *                       example: "LAWYER_CAPACITY_EXCEEDED"
 *                     - type: string
 *                       example: "CLIENT_CAPACITY_EXCEEDED"
 *                 timestamp: { type: string, example: "2025-09-15T21:40:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/create" }
 *       '500':
 *         description: "Internal Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 500 }
 *                 message: { type: string, example: "Internal Server Error" }
 *                 description:
 *                   type: string
 *                   oneOf:
 *                     - type: string
 *                       example: "NEED_MIN_2_STATUSES"
 *                     - type: string
 *                       example: "Unexpected server error"
 *                 timestamp: { type: string, example: "2025-09-15T21:40:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/create" }
 */

router.post(
  "/",
  authenticateToken,
  asyncHandler(controller.handle.bind(controller))
);

export { router as createCaseRoutes };
