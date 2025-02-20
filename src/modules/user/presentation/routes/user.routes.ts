import { Router } from 'express';
import { registerController, loginController } from '../controllers/user.controller';

const router = Router();

/**
 * @openapi
 * /register:
 *  post:
 *    tags:
 *      - Users
 *    summary: Register a new user
 *    description: Register a new user with the provided details.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - password_hash
 *              - first_name
 *              - last_name
 *              - role
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *                example: "user@example.com"
 *              password_hash:
 *                type: string
 *                format: password
 *                example: "password123"
 *              first_name:
 *                type: string
 *                example: "John"
 *              last_name:
 *                type: string
 *                example: "Doe"
 *              role:
 *                type: string
 *                enum: [CLIENT, LAWYER]
 *                example: "CLIENT"
 *              national_registry:
 *                type: string
 *                example: "123456789"
 *                description: Required only if role is LAWYER.
 *              specialty:
 *                type: array
 *                items:
 *                  type: string
 *                example: ["Derecho Civil", "Derecho Laboral"]
 *                description: Required only if role is LAWYER.
 *    responses:
 *      201:
 *        description: User registered successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Usuario registrado exitosamente"
 *                user:
 *                  $ref: '#/components/schemas/User'
 *      400:
 *        description: Invalid request body (extra fields, missing fields, etc.)
 *      500:
 *        description: Internal server error
 */
router.post('/register', registerController);

/**
 * @openapi
 * /login:
 *  post:
 *    tags:
 *      - Users
 *    summary: User login
 *    description: Authenticate a user and return a token if credentials are valid.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - password_hash
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *                example: "user@example.com"
 *              password_hash:
 *                type: string
 *                format: password
 *                example: "password123"
 *    responses:
 *      200:
 *        description: Successful login
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Login exitoso"
 *                user:
 *                  $ref: '#/components/schemas/User'
 *                token:
 *                  type: string
 *                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                  description: JWT token for authenticated requests.
 *      400:
 *        description: Invalid request body (extra fields, missing fields, etc.)
 *      401:
 *        description: Unauthorized - Invalid email or password
 *      500:
 *        description: Internal server error
 */
router.post('/login', loginController);

export default router;