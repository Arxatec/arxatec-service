// src/modules/waitlist/presentation/waitlist.routes.ts
import { Router } from "express";
import { asyncHandler } from "../../../middlewares/async_handler";
import { WaitlistController } from "./waitlist.controller";

const router = Router();
const ctrl = new WaitlistController();

/**
 * Subscribe to waitlist
 * @openapi
 * /waitlist:
 *   post:
 *     tags:
 *       - Waitlist
 *     summary: "Subscribe to waitlist"
 *     description: "Suscribe un usuario a la lista de espera y envía un correo de confirmación."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 example: "Yems"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "yems@example.com"
 *     responses:
 *       '200':
 *         description: "Suscripción exitosa"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "OK"
 *                 description:
 *                   type: string
 *                   example: "Te has suscrito correctamente a la lista de espera."
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T19:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/waitlist"
 *       '400':
 *         description: "Bad Request (ya suscrito o validación Zod)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Bad Request"
 *                 description:
 *                   type: string
 *                   oneOf:
 *                     - type: string
 *                       example: "Ya estás suscrito a la lista de espera."
 *                     - type: string
 *                       example: "El nombre es obligatorio"
 *                     - type: string
 *                       example: "El nombre debe tener al menos 2 caracteres"
 *                     - type: string
 *                       example: "El correo electrónico es obligatorio"
 *                     - type: string
 *                       example: "El formato del correo electrónico no es válido, revisa que esté escrito correctamente"
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T19:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/waitlist"
 *       '500':
 *         description: "Internal Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 description:
 *                   type: string
 *                   oneOf:
 *                     - type: string
 *                       example: "Error al enviar el correo de confirmación"
 *                     - type: string
 *                       example: "Error inesperado al suscribirse a la lista de espera"
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T19:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/waitlist"
 */

router.post("/", asyncHandler(ctrl.subscribe));

export { router as waitlistRoute };
