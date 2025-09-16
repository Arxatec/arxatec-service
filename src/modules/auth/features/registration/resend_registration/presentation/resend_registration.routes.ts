// src/modules/auth/features/registration/resend_registration/presentation/resend_registration.routes.ts
import { Router } from "express";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { ResendRegistrationService } from "./resend_registration.service";
import { ResendRegistrationController } from "./resend_registration.controller";

export const resendRegistrationRouter = Router();
const resendRegistrationService = new ResendRegistrationService();
const resendRegistrationController = new ResendRegistrationController(
  resendRegistrationService
);

/**
 * Resend registration verification code
 * @openapi
 * /auth/register/resend:
 *   post:
 *     tags:
 *       - Auth
 *     summary: "Resend registration verification code"
 *     description: "Reenvía el código de verificación para completar el registro (requiere que exista un usuario temporal en espera de verificación)."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "usuario@ejemplo.com"
 *     responses:
 *       '200':
 *         description: "Verification code resent successfully"
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
 *                   example: "Verification code resent successfully."
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T19:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/register/resend"
 *       '400':
 *         description: "Bad Request (errores de validación Zod)"
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
 *                       example: "El correo electrónico es obligatorio"
 *                     - type: string
 *                       example: "El formato del correo electrónico no es válido, revisa que esté escrito correctamente"
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T19:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/register/resend"
 *       '404':
 *         description: "Not Found (no existe usuario temporal para ese email)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Not Found"
 *                 description:
 *                   type: string
 *                   example: "User not found"
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T19:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/register/resend"
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
 *                       example: "Error retrieving temporary user"
 *                     - type: string
 *                       example: "Error generating or retrieving verification code"
 *                     - type: string
 *                       example: "Error al generar la plantilla del correo"
 *                     - type: string
 *                       example: "Error al enviar el correo de verificación"
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T19:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/register/resend"
 */

resendRegistrationRouter.post(
  "/resend",
  asyncHandler((req, res) =>
    resendRegistrationController.resendRegistration(req, res)
  )
);
