import { Router } from "express";
import { VerifyCodeRegistrationController } from "./verify_code_registration.controller";
import { VerifyCodeRegistrationService } from "./verify_code_registration.service";
import { asyncHandler } from "../../../../../../middlewares";

export const verifyCodeRegistrationRouter = Router();
const verifyCodeRegistrationService = new VerifyCodeRegistrationService();
const verifyCodeRegistrationController = new VerifyCodeRegistrationController(
  verifyCodeRegistrationService
);

/**
 * Verify registration code
 * @openapi
 * /api/v1/auth/register/verify-code:
 *    post:
 *      tags:
 *        - Auth
 *      summary: "Verify registration code"
 *      description: "Verify the code sent to user's email to complete registration"
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
 *                  example: "usuario@example.com"
 *                code:
 *                  type: string
 *                  example: "1234"
 *      responses:
 *        '200':
 *          description: "User verified and registered successfully"
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
 *                    example: "User verified and registered successfully"
 *                  description:
 *                    type: string
 *                    example: "User verified and registered successfully"
 *                  timestamp:
 *                    type: string
 *                    example: "2023-10-15T14:30:00.000Z"
 *                  path:
 *                    type: string
 *                    example: "/api/v1/auth/verify-code"
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
 *                        example: "Invalid verification code"
 *                      - type: string
 *                        example: "Invalid or expired verification code"
 *                      - type: string
 *                        example: "Temporary user data not found"
 *                      - type: string
 *                        example: "Verification code is required"
 *                      - type: string
 *                        example: "Invalid email format"
 *                  timestamp:
 *                    type: string
 *                    example: "2023-10-15T14:30:00.000Z"
 *                  path:
 *                    type: string
 *                    example: "/api/v1/auth/verify-code"
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
 *                        example: "Error creating user"
 *                      - type: string
 *                        example: "Error retrieving verification code"
 *                      - type: string
 *                        example: "Error retrieving temporary user data"
 *                      - type: string
 *                        example: "Error removing temporary data"
 *                      - type: string
 *                        example: "Verification process failed"
 *                  timestamp:
 *                    type: string
 *                    example: "2023-10-15T14:30:00.000Z"
 *                  path:
 *                    type: string
 *                    example: "/api/v1/auth/verify-code"
 */
verifyCodeRegistrationRouter.post(
  "/verify-code",
  asyncHandler((req, res) =>
    verifyCodeRegistrationController.verifyCodeRegistration(req, res)
  )
);
