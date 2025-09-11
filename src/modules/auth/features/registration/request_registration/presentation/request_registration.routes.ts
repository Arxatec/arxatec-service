// src/modules/auth/features/registration/request_reqistration/presentation/request_registration.routes.ts
import { Router } from "express";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { RequestRegistrationController } from "./request_registration.controller";
import { RequestRegistrationService } from "./request_registration.service";

export const requestRegistrationRouter = Router();
const requestRegistrationService = new RequestRegistrationService();
const requestRegistrationController = new RequestRegistrationController(
  requestRegistrationService
);
/**
 * Request user registration
 * @openapi
 * /api/v1/auth/register/request:
 *   post:
 *     tags:
 *       - Auth
 *     summary: "Request user registration"
 *     description: "Initiate the registration process for a new user and send verification code to email"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *               - confirm_password
 *             properties:
 *               first_name:
 *                 type: string
 *                 minLength: 2
 *                 example: "Juan"
 *               last_name:
 *                 type: string
 *                 minLength: 2
 *                 example: "Pérez"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "juan.perez@example.com"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: "password123"
 *               confirm_password:
 *                 type: string
 *                 minLength: 8
 *                 example: "password123"
 *     responses:
 *       '200':
 *         description: "Registration request processed successfully"
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
 *                   example: "Verification code sent successfully."
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-15T14:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/register/request"
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
 *                   enum:
 *                     - "Bad Request"
 *                 description:
 *                   type: string
 *                   oneOf:
 *                     - type: string
 *                       example: "Email is already in use"
 *                     - type: string
 *                       example: "First name must have at least 2 characters"
 *                     - type: string
 *                       example: "Last name must have at least 2 characters"
 *                     - type: string
 *                       example: "Invalid email format"
 *                     - type: string
 *                       example: "Password must have at least 8 characters"
 *                     - type: string
 *                       example: "Passwords do not match"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-15T14:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/register/request"
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
 *                       example: "Error creating temporary user"
 *                     - type: string
 *                       example: "Error generating email template"
 *                     - type: string
 *                       example: "Error sending verification email"
 *                     - type: string
 *                       example: "Registration process failed"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-15T14:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/register/request"
 */
requestRegistrationRouter.post(
  "/request",
  asyncHandler((req, res) =>
    requestRegistrationController.requestRegistration(req, res)
  )
);
