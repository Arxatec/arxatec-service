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
 * /cases/update{id}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cases - Manage
 *     summary: "Update case"
 *     description: >
 *       Actualiza un caso. Reglas de negocio:
 *       - `is_public` y `status` se derivan automáticamente (no vienen en el body).
 *       - Cliente puede asignar abogado **solo si** el caso aún es público y sin abogado → el caso pasa a **privado** y estado **taken**.
 *       - Cliente **no** puede modificar `external_client_id`.
 *       - Abogado **no** puede modificar `selected_lawyer_id`.
 *       - Abogado puede cambiar `external_client_id` a uno propio (no archivado).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
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
 *               reference_code:
 *                 type: string
 *                 maxLength: 50
 *               selected_lawyer_id:
 *                 type: string
 *                 format: uuid
 *                 description: "Solo CLIENTE. Convierte caso público → privado (estado taken) si aún no tiene abogado."
 *               external_client_id:
 *                 type: string
 *                 format: uuid
 *                 description: "Solo ABOGADO. Debe pertenecer al abogado (no archivado)."
 *           examples:
 *             client_edit_text_category:
 *               summary: Cliente edita texto/categoría (sigue público)
 *               value:
 *                 title: "Consulta por cobro indebido (ampliada)"
 *                 description: "Actualizo con más detalle…"
 *                 category_id: "cccccccc-cccc-cccc-cccc-cccccccccccc"
 *                 urgency: "alta"
 *                 reference_code: "REF-2025-045"
 *             client_take_assign_lawyer:
 *               summary: Cliente (público → asigna abogado, pasa a privado/taken)
 *               value:
 *                 selected_lawyer_id: "llllllll-llll-llll-llll-llllllllllll"
 *             lawyer_change_external_client:
 *               summary: Abogado cambia cliente externo (propio)
 *               value:
 *                 external_client_id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"
 *             lawyer_edit_text:
 *               summary: Abogado edita texto
 *               value:
 *                 title: "Revisión de contrato mercantil (v2)"
 *                 description: "Añadir cláusulas de no competencia y confidencialidad…"
 *     responses:
 *       '200':
 *         description: "Case updated"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 200 }
 *                 message: { type: string, example: "OK" }
 *                 description: { type: string, example: "OK" }
 *                 timestamp: { type: string, example: "2025-09-18T21:40:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/{id}" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     case:
 *                       type: object
 *                       properties:
 *                         id: { type: string, example: "84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *                         service_id: { type: string, example: "2b1c3d4e-5f60-4718-9abc-1234567890ab" }
 *                         title: { type: string, example: "Consulta por cobro indebido (ampliada)" }
 *                         description: { type: string, example: "Actualizo con más detalle…" }
 *                         category_id: { type: string, example: "cccccccc-cccc-cccc-cccc-cccccccccccc" }
 *                         status_id: { type: string, example: "7a9f6a49-7c5a-43c7-8b1e-9c2c9b3b8e13" }
 *                         urgency: { type: string, example: "alta" }
 *                         is_public: { type: boolean, example: true }
 *                         reference_code: { type: string, nullable: true, example: "REF-2025-045" }
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
 *                       example: "El título debe tener al menos 5 caracteres"
 *                     - type: string
 *                       example: "La descripción debe tener al menos 20 caracteres"
 *                     - type: string
 *                       example: "El ID de la categoría debe tener formato UUID"
 *                     - type: string
 *                       example: "La urgencia debe ser 'baja', 'media' o 'alta'"
 *                     - type: string
 *                       example: "ID inválido"
 *                 timestamp: { type: string, example: "2025-09-18T21:40:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/{id}" }
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
 *                       example: "ACCESS_DENIED"
 *                     - type: string
 *                       example: "EXTERNAL_CLIENT_NOT_ALLOWED_FOR_CLIENT"
 *                     - type: string
 *                       example: "LAWYER_CANNOT_CHANGE_ASSIGNED_LAWYER"
 *                     - type: string
 *                       example: "EXTERNAL_CLIENT_NOT_FOUND"
 *                 timestamp: { type: string, example: "2025-09-18T21:40:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/{id}" }
 *       '404':
 *         description: "Not Found (caso no existe)"
 *       '409':
 *         description: "Conflict (estado/ciclo de vida)"
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
 *                       example: "CANNOT_EDIT_CLOSED"
 *                     - type: string
 *                       example: "CANNOT_EDIT_ARCHIVED"
 *                     - type: string
 *                       example: "ONLY_PUBLIC_TAKE"
 *                     - type: string
 *                       example: "ALREADY_TAKEN"
 *                 timestamp: { type: string, example: "2025-09-18T21:40:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/{id}" }
 *       '500':
 *         description: "Internal Server Error"
 */

router.patch("/:id", authenticateToken, asyncHandler(ctrl.patch));

export { router as updateCaseRoutes };
