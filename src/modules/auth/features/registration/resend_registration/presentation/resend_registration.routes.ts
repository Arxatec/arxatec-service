import { Router } from "express";
import { asyncHandler } from "../../../../../../middlewares";
import { ResendRegistrationService } from "./resend_registration.service";
import { ResendRegistrationController } from "./resend_registration.controller";

export const resendRegistrationRouter = Router();
const resendRegistrationService = new ResendRegistrationService();
const resendRegistrationController = new ResendRegistrationController(
  resendRegistrationService
);

/**
 * Reenviar código de registro
 * @openapi
 * /api/v1/auth/register/resend:
 *    post:
 *      tags:
 *        - Auth
 *      summary: "Resend registration verification code"
 *      description: "Resend the verification code to complete the registration process"
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
 *                  example: "usuario@ejemplo.com"
 *      responses:
 *        '200':
 *          description: "Verification code resent successfully"
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
 *                  timestamp:
 *                    type: string
 *                    example: "2023-10-15T14:30:00.000Z"
 *                  path:
 *                    type: string
 *                    example: "/api/v1/auth/register/resend"
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
 *                    enum:
 *                      - "Bad Request"
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
 *                    example: "/api/v1/auth/register/resend"
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
 *                    example: "User not found"
 *                  timestamp:
 *                    type: string
 *                    example: "2023-10-15T14:30:00.000Z"
 *                  path:
 *                    type: string
 *                    example: "/api/v1/auth/register/resend"
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
 *                        example: "Error retrieving temporary user"
 *                      - type: string
 *                        example: "Error generating verification code"
 *                      - type: string
 *                        example: "Error generating email template"
 *                      - type: string
 *                        example: "Error sending verification email"
 *                  timestamp:
 *                    type: string
 *                    example: "2023-10-15T14:30:00.000Z"
 *                  path:
 *                    type: string
 *                    example: "/api/v1/auth/register/resend"
 */
resendRegistrationRouter.post(
  "/resend",
  asyncHandler((req, res) =>
    resendRegistrationController.resendRegistration(req, res)
  )
);
