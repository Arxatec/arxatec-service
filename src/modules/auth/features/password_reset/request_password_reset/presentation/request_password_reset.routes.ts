import { Router } from "express";
import { asyncHandler } from "../../../../../../middlewares";
import { RequestPasswordResetService } from "./request_password_reset.service";
import { RequestPasswordResetController } from "./request_password_reset.controller";

export const requestPasswordResetRouter = Router();
const requestPasswordResetService = new RequestPasswordResetService();
const requestPasswordResetController = new RequestPasswordResetController(
  requestPasswordResetService
);

/**
 * Request password reset
 * @openapi
 * /api/v1/auth/password-reset/request:
 *    post:
 *      tags:
 *        - Forgot Password
 *      summary: "Request password reset"
 *      description: "Send a verification code to the user's email to start the password reset process"
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - email
 *              properties:
 *                email:
 *                  type: string
 *                  format: email
 *                  example: "usuario@example.com"
 *      responses:
 *        '200':
 *          description: "Password reset code sent successfully"
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                    example: 200
 *                  message:
 *                    type: string
 *                    example: "1234"
 *                  description:
 *                    type: string
 *                    example: "A verification code has been sent to your email"
 *                  timestamp:
 *                    type: string
 *                    example: "2023-10-15T14:30:00.000Z"
 *                  path:
 *                    type: string
 *                    example: "/api/v1/auth/password-reset/request"
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
 *                    example: "Bad Request"
 *                  description:
 *                    type: string
 *                    oneOf:
 *                      - type: string
 *                        example: "Email is required"
 *                      - type: string
 *                        example: "Invalid email format"
 *                  timestamp:
 *                    type: string
 *                    example: "2023-10-15T14:30:00.000Z"
 *                  path:
 *                    type: string
 *                    example: "/api/v1/auth/password-reset/request"
 *        '404':
 *          description: "Not Found"
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                    example: 404
 *                  message:
 *                    type: string
 *                    example: "Not Found"
 *                  description:
 *                    type: string
 *                    example: "User not found"
 *                  timestamp:
 *                    type: string
 *                    example: "2023-10-15T14:30:00.000Z"
 *                  path:
 *                    type: string
 *                    example: "/api/v1/auth/password-reset/request"
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
 *                    oneOf:
 *                      - type: string
 *                        example: "Email sending failed"
 *                      - type: string
 *                        example: "Error generating email template"
 *                      - type: string
 *                        example: "Error creating temporary code"
 *                  timestamp:
 *                    type: string
 *                    example: "2023-10-15T14:30:00.000Z"
 *                  path:
 *                    type: string
 *                    example: "/api/v1/auth/password-reset/request"
 */
requestPasswordResetRouter.post(
  "/request",
  asyncHandler((req, res) =>
    requestPasswordResetController.requestPasswordReset(req, res)
  )
);
