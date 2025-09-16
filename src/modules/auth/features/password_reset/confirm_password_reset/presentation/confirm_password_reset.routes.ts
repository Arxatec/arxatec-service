// src/modules/auth/features/password_reset/confirm_password_reset/presentation/confirm_password_reset.routes.ts
import { Router } from "express";
import { ConfirmPasswordResetController } from "./confirm_password_reset.controller";
import { ConfirmPasswordResetService } from "./confirm_password_reset.service";
import { asyncHandler } from "../../../../../../middlewares/async_handler";

export const confirmPasswordResetRouter = Router();
const confirmPasswordResetService = new ConfirmPasswordResetService();
const confirmPasswordResetController = new ConfirmPasswordResetController(
  confirmPasswordResetService
);

/**
 * Confirm password reset
 * @openapi
 * /auth/password-reset/confirm:
 *   post:
 *     tags:
 *       - Forgot Password
 *     summary: "Confirm password reset"
 *     description: "Completa el cambio de contraseña estableciendo una nueva."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - confirm_password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "usuario@ejemplo.com"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 20
 *                 example: "NuevaContra123"
 *               confirm_password:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 20
 *                 example: "NuevaContra123"
 *     responses:
 *       '201':
 *         description: "Password reset completed successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Created"
 *                 description:
 *                   type: string
 *                   example: "Password reset successfully"
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T19:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/password-reset/confirm"
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
 *                     - type: string
 *                       example: "La contraseña es obligatoria"
 *                     - type: string
 *                       example: "La contraseña debe tener al menos 8 caracteres"
 *                     - type: string
 *                       example: "La contraseña no puede tener más de 20 caracteres"
 *                     - type: string
 *                       example: "La confirmación de contraseña es obligatoria"
 *                     - type: string
 *                       example: "La confirmación de contraseña debe tener al menos 8 caracteres"
 *                     - type: string
 *                       example: "La confirmación de contraseña no puede tener más de 20 caracteres"
 *                     - type: string
 *                       example: "Las contraseñas no coinciden, por favor verifica que las contraseñas coincidan."
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T19:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/password-reset/confirm"
 *       '404':
 *         description: "Not Found (usuario no encontrado)"
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
 *                   example: "Usuario no encontrado"
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T19:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/password-reset/confirm"
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
 *                   example: "Error inesperado en el servidor"
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T19:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/password-reset/confirm"
 */

confirmPasswordResetRouter.post(
  "/confirm",
  asyncHandler((req, res) =>
    confirmPasswordResetController.confirmPasswordReset(req, res)
  )
);
