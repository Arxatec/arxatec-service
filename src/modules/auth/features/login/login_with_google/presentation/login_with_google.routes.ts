// src/modules/auth/features/login/login_with_google/presentation/login_with_google.routes.ts
import { Router } from "express";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { LoginGoogleController } from "./login_with_google.controller";
import { LoginGoogleService } from "./login_with_google.service";

export const loginGoogleRouter = Router();
const loginGoogleService = new LoginGoogleService();
const loginGoogleController = new LoginGoogleController(loginGoogleService);

/**
 * Login user with Google
 * @openapi
 * /api/v1/auth/login/google:
 *   post:
 *     tags:
 *       - Auth
 *     summary: "Login user with Google"
 *     description: "Allows a user to authenticate in the system using Google authentication"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - googleToken
 *             properties:
 *               googleToken:
 *                 type: string
 *                 example: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFlOTczZWUwZTE..."
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
 *                   example: "Login with Google successful"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-15T14:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/login/google"
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
 *                   example: "Google token is required"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-15T14:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/login/google"
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
 *                       example: "Invalid Google token"
 *                     - type: string
 *                       example: "Authentication failed"
 *                     - type: string
 *                       example: "User is not verified"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-15T14:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/login/google"
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
 *                   example: "/api/v1/auth/login/google"
 */
loginGoogleRouter.post(
  "/google",
  asyncHandler((req, res) => loginGoogleController.loginWithGoogle(req, res))
);
