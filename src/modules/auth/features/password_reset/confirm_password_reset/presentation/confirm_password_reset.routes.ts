import { Router } from "express";
import { ConfirmPasswordResetController } from "./confirm_password_reset.controller";
import { ConfirmPasswordResetService } from "./confirm_password_reset.service";
import { asyncHandler } from "../../../../../../middlewares";

export const confirmPasswordResetRouter = Router();
const confirmPasswordResetService = new ConfirmPasswordResetService();
const confirmPasswordResetController = new ConfirmPasswordResetController(
  confirmPasswordResetService
);

/**
 * Confirm password reset
 * @openapi
 * /api/v1/auth/password-reset/confirm:
 *    post:
 *      tags:
 *        - Forgot Password
 *      summary: "Confirm password reset"
 *      description: "Complete the password reset process by setting a new password"
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - email
 *                - password
 *                - confirm_password
 *              properties:
 *                email:
 *                  type: string
 *                  format: email
 *                  example: "usuario@ejemplo.com"
 *                password:
 *                  type: string
 *                  minLength: 8
 *                  maxLength: 20
 *                  example: "nuevaContraseña123"
 *                confirm_password:
 *                  type: string
 *                  minLength: 8
 *                  maxLength: 20
 *                  example: "nuevaContraseña123"
 *      responses:
 *        '201':
 *          description: "Password reset completed successfully"
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
 *                    example: "Password reset successfully"
 *                  timestamp:
 *                    type: string
 *                    example: "2023-10-15T14:30:00.000Z"
 *                  path:
 *                    type: string
 *                    example: "/api/v1/auth/password-reset/confirm"
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
 *                        example: "Email is required"
 *                      - type: string
 *                        example: "Invalid email address"
 *                      - type: string
 *                        example: "Password is required"
 *                      - type: string
 *                        example: "Password must be at least 8 characters long"
 *                      - type: string
 *                        example: "Password must be less than 20 characters long"
 *                      - type: string
 *                        example: "Confirm password is required"
 *                      - type: string
 *                        example: "Confirm password must be at least 8 characters long"
 *                      - type: string
 *                        example: "Confirm password must be less than 20 characters long"
 *                      - type: string
 *                        example: "Passwords do not match"
 *                  timestamp:
 *                    type: string
 *                    example: "2023-10-15T14:30:00.000Z"
 *                  path:
 *                    type: string
 *                    example: "/api/v1/auth/password-reset/confirm"
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
 *                  description:
 *                    type: string
 *                    example: "Error updating user password"
 *                  timestamp:
 *                    type: string
 *                    example: "2023-10-15T14:30:00.000Z"
 *                  path:
 *                    type: string
 *                    example: "/api/v1/auth/password-reset/confirm"
 */

confirmPasswordResetRouter.post(
  "/confirm",
  asyncHandler((req, res) =>
    confirmPasswordResetController.confirmPasswordReset(req, res)
  )
);
