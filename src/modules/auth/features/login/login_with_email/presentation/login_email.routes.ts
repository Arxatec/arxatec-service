//src/modules/auth/features/login/login_with_email/presentation/login_with_email.routes.ts
import { Router } from "express";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { LoginController } from "./login_with_email.controller";
import { LoginService } from "./login_with_email.service";

export const loginRouter = Router();
const loginService = new LoginService();
const loginController = new LoginController(loginService);

/**
 * Login user
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: "Login user"
 *     description: "Permite autenticar a un usuario y obtener su token de acceso (JWT)."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "usuario@example.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "contrasena123"
 *     responses:
 *       '200':
 *         description: "Login successful"
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
 *                   example: "Login successful"
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T19:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/login"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "84ea6d2a-d171-48d0-af0f-74c8a5b2eb29"
 *                         firstName:
 *                           type: string
 *                           example: "Juan"
 *                         lastName:
 *                           type: string
 *                           example: "Pérez"
 *                         email:
 *                           type: string
 *                           example: "usuario@example.com"
 *                         userType:
 *                           type: string
 *                           nullable: true
 *                           enum: [admin, client, lawyer, null]
 *                           example: "client"
 *                         role:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
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
 *                       example: "La contraseña debe tener al menos 6 caracteres"
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T19:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/login"
 *       '401':
 *         description: "Unauthorized (credenciales inválidas o usuario no verificado)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *                 description:
 *                   type: string
 *                   oneOf:
 *                     - type: string
 *                       example: "Credenciales inválidas, revisa que el correo electrónico y la contraseña sean correctos."
 *                     - type: string
 *                       example: "El usuario no está verificado, por favor verifica tu correo electrónico."
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T19:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/login"
 *       '404':
 *         description: "Not Found (usuario no existe)"
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
 *                   example: "El usuario no existe, revisa que el correo electrónico sea correcto."
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T19:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/login"
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
 *                   example: "/api/v1/auth/login"
 */

loginRouter.post(
  "/",
  asyncHandler((req, res) => loginController.login(req, res))
);
