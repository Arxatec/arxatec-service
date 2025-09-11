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
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: "Login user"
 *     description: "Allows a user to authenticate in the system and obtain their access token"
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
 *                 example: "contraseña123"
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
 *                   example: "2023-10-15T14:30:00.000Z"
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
 *                           example: "client"
 *                         role:
 *                           type: string
 *                           nullable: true
 *                           example: "superadmin"
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       '400':
 *         description: "Bad Request"
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
 *                       example: "Email is required"
 *                     - type: string
 *                       example: "Invalid email format"
 *                     - type: string
 *                       example: "Password is required"
 *                     - type: string
 *                       example: "Password must have at least 6 characters"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-15T14:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/login"
 *       '401':
 *         description: "Unauthorized"
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
 *                       example: "Invalid credentials"
 *                     - type: string
 *                       example: "User is not verified"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-15T14:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/login"
 *       '404':
 *         description: "Not Found"
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
 *                   example: "2023-10-15T14:30:00.000Z"
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
 *                   example: "Error message details"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-15T14:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/login"
 */
loginRouter.post(
  "/",
  asyncHandler((req, res) => loginController.login(req, res))
);
