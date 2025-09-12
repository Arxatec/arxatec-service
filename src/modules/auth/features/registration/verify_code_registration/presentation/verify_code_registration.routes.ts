//src/modules/auth/features/registration/verify_code_registration/presentation/verify_code_registration.routes.ts
import { Router } from "express";
import { VerifyCodeRegistrationController } from "./verify_code_registration.controller";
import { VerifyCodeRegistrationService } from "./verify_code_registration.service";
import { asyncHandler } from "../../../../../../middlewares/async_handler";

export const verifyCodeRegistrationRouter = Router();
const verifyCodeRegistrationService = new VerifyCodeRegistrationService();
const verifyCodeRegistrationController = new VerifyCodeRegistrationController(
  verifyCodeRegistrationService
);
/**
 * Verify registration code
 * @openapi
 * /api/v1/auth/register/verify-code:
 *   post:
 *     tags:
 *       - Auth
 *     summary: "Verify registration code"
 *     description: "Verify the code sent to user's email to complete registration"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "usuario@example.com"
 *               code:
 *                 type: string
 *                 minLength: 4
 *                 maxLength: 4
 *                 example: "1234"
 *     responses:
 *       '201':
 *         description: "User verified and registered successfully"
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
 *                   example: "User verified and registered successfully"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-15T14:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/register/verify-code"
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
 *                       example: "Invalid or expired verification code"
 *                     - type: string
 *                       example: "Temporary user data not found"
 *                     - type: string
 *                       example: "Verification code is required"
 *                     - type: string
 *                       example: "Invalid email format"
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
 *                   example: "Invalid verification code"
 *       '409':
 *         description: "Conflict"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 409
 *                 message:
 *                   type: string
 *                   example: "Conflict"
 *                 description:
 *                   type: string
 *                   example: "Email is already registered"
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
 *                       example: "Error creating user"
 *                     - type: string
 *                       example: "Error retrieving verification code"
 *                     - type: string
 *                       example: "Error retrieving temporary user data"
 *                     - type: string
 *                       example: "Error removing temporary data"
 *                     - type: string
 *                       example: "Verification process failed"
 */
verifyCodeRegistrationRouter.post(
  "/verify-code",
  asyncHandler((req, res) =>
    verifyCodeRegistrationController.verifyCodeRegistration(req, res)
  )
);
