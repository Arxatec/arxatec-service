// src/modules/cases/features/manage/change_status/presentation/change_status.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { ChangeStatusController } from "./change_status.controller";

const router = Router();
const ctrl = new ChangeStatusController();

/**
 * Change case status
 * @openapi
 * /cases/status/{id}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cases - Manage
 *     summary: "Change case status"
 *     description: "Cambia el estado de un caso. Reglas de flujo: **abierto → tomado → cerrado**. El cliente solo puede avanzar al siguiente; el abogado puede avanzar/retroceder un paso y cerrar solo si es el abogado asignado."
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
 *             required:
 *               - status_id
 *             properties:
 *               status_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID del nuevo estado.
 *                 example: "7a9f6a49-7c5a-43c7-8b1e-9c2c9b3b8e13"
 *               note:
 *                 type: string
 *                 maxLength: 255
 *                 description: Nota opcional para el cambio de estado.
 *                 example: "Cliente confirmó avance del caso."
 *     responses:
 *       '200':
 *         description: "Estado cambiado correctamente"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 200 }
 *                 message: { type: string, example: "OK" }
 *                 description: { type: string, example: "OK" }
 *                 timestamp: { type: string, example: "2025-09-15T21:25:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/status/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     case:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                           example: "STATUS_CHANGED"
 *                         status:
 *                           type: string
 *                           example: "Tomado"
 *                     user:
 *                       type: object
 *                       properties:
 *                         id: { type: string, example: "1c2b3a4d-5e6f-7081-92a3-b4c5d6e7f809" }
 *                         role: { type: string, enum: [client, lawyer], example: "lawyer" }
 *       '400':
 *         description: "Bad Request (validación y estado inválido)"
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
 *                       example: "El ID del estado es obligatorio"
 *                     - type: string
 *                       example: "El ID del estado debe tener formato UUID"
 *                     - type: string
 *                       example: "La nota no puede superar los 255 caracteres"
 *                     - type: string
 *                       example: "INVALID_STATUS"
 *                 timestamp: { type: string, example: "2025-09-15T21:25:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/status/invalid" }
 *       '401':
 *         description: "Unauthorized (token inválido o no enviado)"
 *       '403':
 *         description: "Forbidden (restricciones de autorización/flujo)"
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
 *                       example: "CLOSE_ONLY_LAWYER"       # Solo el abogado asignado puede cerrar
 *                 timestamp: { type: string, example: "2025-09-15T21:25:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/status/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
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
 *                 timestamp: { type: string, example: "2025-09-15T21:25:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/status/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *       '409':
 *         description: "Conflict (restricciones de negocio)"
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
 *                       example: "ALREADY_CLOSED"                 # El caso ya está cerrado
 *                     - type: string
 *                       example: "NEXT_STATUS_ONLY"              # Cliente solo puede avanzar
 *                     - type: string
 *                       example: "INVALID_TRANSITION_LAWYER"     # Abogado solo pasos adyacentes
 *                     - type: string
 *                       example: "LIMIT_INPROGRESS_LAWYER"       # Límite de casos 'tomado' para el abogado
 *                 timestamp: { type: string, example: "2025-09-15T21:25:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/status/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
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
 *                       example: "NEED_MIN_3_STATUSES"
 *                     - type: string
 *                       example: "MISSING_STANDARD_STATUSES"
 *                     - type: string
 *                       example: "Unexpected server error"
 *                 timestamp: { type: string, example: "2025-09-15T21:25:00.000Z" }
 *                 path: { type: string, example: "/api/v1/cases/status/84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 */

router.patch("/:id", authenticateToken, asyncHandler(ctrl.patch));

export { router as changeStatusRoutes };
