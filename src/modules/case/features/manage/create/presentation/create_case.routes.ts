// src/modules/cases/features/create_case/presentation/routes/create_case.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { CreateCaseController } from "./create_case.controller";

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
 *     description: >
 *       Crea un caso. **No envíes `is_public` ni `status_id`**: se derivan por reglas.
 *       Reglas:
 *       - **Cliente**:
 *         - Si **NO** envía `selected_lawyer_id` → **público** y estado **open**.
 *         - Si **SÍ** envía `selected_lawyer_id` → **privado** y estado **taken**.
 *       - **Abogado**:
 *         - Debe enviar `external_client_id` (cliente externo propio y no archivado).
 *         - El caso es **privado** y estado **taken**.
 *       - `service_id` es opcional (para vincular a un service existente).
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
 *                 description: "Opcional. UUID de un service existente."
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 120
 *               description:
 *                 type: string
 *                 minLength: 20
 *                 maxLength: 2000
 *               category_id:
 *                 type: string
 *                 format: uuid
 *               urgency:
 *                 type: string
 *                 enum: [alta, media, baja]
 *                 default: media
 *               reference_code:
 *                 type: string
 *                 maxLength: 50
 *                 nullable: true
 *               selected_lawyer_id:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: "Solo CLIENTE. Convierte el caso en privado/taken."
 *               external_client_id:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: "Solo ABOGADO. Debe pertenecer al abogado (no archivado)."
 *           examples:
 *             client_public:
 *               summary: client - public
 *               value:
 *                 title: "Consulta por cobro indebido"
 *                 description: "Me están cobrando penalidad fuera de contrato, necesito orientación."
 *                 category_id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
 *             client_private:
 *               summary: client - private
 *               value:
 *                 title: "Demanda por desalojo"
 *                 description: "El inquilino no paga hace 6 meses, requiero iniciar proceso de desalojo."
 *                 category_id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
 *                 selected_lawyer_id: "llllllll-llll-llll-llll-llllllllllll"
 *             lawyer_client_external:
 *               summary: lawyer - client external (private)
 *               value:
 *                 title: "Revisión de contrato mercantil"
 *                 description: "Cliente externo requiere revisar cláusulas de no competencia."
 *                 category_id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
 *                 external_client_id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"
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
 *                 timestamp: { type: string, example: "2025-09-18T21:40:00.000Z" }
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
 *         description: "Bad Request (validación)"
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
 *                       example: "El título debe tener al menos 5 caracteres"
 *                     - type: string
 *                       example: "La descripción debe tener al menos 20 caracteres"
 *                     - type: string
 *                       example: "El ID de la categoría debe tener formato UUID"
 *                     - type: string
 *                       example: "La urgencia debe ser 'alta', 'media' o 'baja'"
 *                     - type: string
 *                       example: "EXTERNAL_CLIENT_REQUIRED_FOR_LAWYER"
 *                 timestamp: { type: string, example: "2025-09-18T21:40:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/create" }
 *       '401':
 *         description: "Unauthorized (token inválido o no enviado)"
 *       '403':
 *         description: "Forbidden (políticas/rol/propiedad)"
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
 *                       example: "EXTERNAL_CLIENT_NOT_ALLOWED_FOR_CLIENT"
 *                     - type: string
 *                       example: "EXTERNAL_CLIENT_NOT_FOUND"
 *                     - type: string
 *                       example: "LAWYER_CAPACITY_EXCEEDED"
 *                     - type: string
 *                       example: "CLIENT_CAPACITY_EXCEEDED"
 *                 timestamp: { type: string, example: "2025-09-18T21:40:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/create" }
 *       '500':
 *         description: "Internal Server Error"
 */

router.post("/", authenticateToken, controller.handle.bind(controller));

export { router as createCaseRoutes };
