// src/modules/auth/features/password_reset/verify_code_password_reset/presentation/verify_code_password_reset.routes.ts
import { Router } from "express";
import { VerifyCodePasswordResetController } from "./verify_code_password_reset.controller";
import { VerifyCodePasswordResetService } from "./verify_code_password_reset.service";
import { asyncHandler } from "../../../../../../middlewares/async_handler";

export const verifyCodePasswordResetRouter = Router();
const verifyCodePasswordResetService = new VerifyCodePasswordResetService();
const verifyCodePasswordResetController = new VerifyCodePasswordResetController(
  verifyCodePasswordResetService
);

/**
 * Verify password reset code
 * @openapi
 * /api/v1/auth/password-reset/verify-code:
 *    post:
 *      tags:
 *        - Forgot Password
 *      summary: "Verify password reset code"
 *      description: "Verify the code sent to the user's email for password reset process"
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - email
 *                - code
 *              properties:
 *                email:
 *                  type: string
 *                  format: email
 *                  example: "usuario@ejemplo.com"
 *                code:
 *                  type: string
 *                  minLength: 4
 *                  maxLength: 4
 *                  example: "1234"
 *      responses:
 *        '201':
 *          description: "Code verified successfully"
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                    example: 201
 *                  message:
 *                    type: string
 *                    example: "Code verified successfully"
 *                  timestamp:
 *                    type: string
 *                    example: "2023-10-15T14:30:00.000Z"
 *                  path:
 *                    type: string
 *                    example: "/api/v1/auth/password-reset/verify-code"
 *        '400':
 *          description: "Bad Request"
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                    example: 400
 *                  message:
 *                    type: string
 *                    oneOf:
 *                      - type: string
 *                        example: "Verification code is required"
 *                      - type: string
 *                        example: "Verification code must be 4 characters long"
 *                      - type: string
 *                        example: "Email is required"
 *                      - type: string
 *                        example: "Invalid email format"
 *                      - type: string
 *                        example: "Code not found"
 *                      - type: string
 *                        example: "Invalid code"
 *                  timestamp:
 *                    type: string
 *                    example: "2023-10-15T14:30:00.000Z"
 *                  path:
 *                    type: string
 *                    example: "/api/v1/auth/password-reset/verify-code"
 *        '500':
 *          description: "Internal Server Error"
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                    example: 500
 *                  message:
 *                    type: string
 *                    example: "Internal Server Error"
 *                  timestamp:
 *                    type: string
 *                    example: "2023-10-15T14:30:00.000Z"
 *                  path:
 *                    type: string
 *                    example: "/api/v1/auth/password-reset/verify-code"
 */
verifyCodePasswordResetRouter.post(
  "/verify-code",
  asyncHandler((req, res) =>
    verifyCodePasswordResetController.verifyCodePasswordReset(req, res)
  )
);
