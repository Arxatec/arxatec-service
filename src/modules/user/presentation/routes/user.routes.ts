import { Router } from "express";
import {
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/user.controller";
import { verifyEmailController } from "../controllers/email.controller";
const router = Router();

/**
 * Autenticación de usuario
 * @openapi
 * /api/v1/auth/login:
 *    post:
 *      tags:
 *        - Users
 *      summary: "User login"
 *      description: "Authenticate a user and return a token if credentials are valid."
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - email
 *                - password
 *              properties:
 *                email:
 *                  type: string
 *                  format: email
 *                  example: "user@example.com"
 *                password:
 *                  type: string
 *                  format: password
 *                  example: "password123"
 *      responses:
 *        '200':
 *          description: "Successful login"
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Login exitoso"
 *                  token:
 *                    type: string
 *                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                    description: "JWT token for authenticated requests."
 *        '400':
 *          description: "Invalid request body (extra fields, missing fields, etc.)"
 *        '401':
 *          description: "Unauthorized - Invalid email or password"
 *        '500':
 *          description: "Internal server error"
 *      security:
 *        - apiKey: []
 */
router.post("/login", loginController);

/**
 * Registro de nuevo usuario
 * @openapi
 * /api/v1/auth/register:
 *    post:
 *      tags:
 *        - Users
 *      summary: "Register a new user"
 *      description: "Registers a new user with the provided details, including email, password, name, and user type."
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - email
 *                - password
 *                - first_name
 *                - last_name
 *                - user_type
 *              properties:
 *                email:
 *                  type: string
 *                  format: email
 *                  example: "user@example.com"
 *                password:
 *                  type: string
 *                  format: password
 *                  example: "password123"
 *                first_name:
 *                  type: string
 *                  example: "John"
 *                last_name:
 *                  type: string
 *                  example: "Doe"
 *                user_type:
 *                  type: string
 *                  enum: [client, lawyer]
 *                  example: "client"
 *                license_number:
 *                  type: string
 *                  example: "123456789"
 *                  description: "Required only if user_type is 'lawyer'."
 *      responses:
 *        '201':
 *          description: "User registered successfully"
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Usuario registrado exitosamente"
 *        '400':
 *          description: "Invalid request body (missing required fields, incorrect data format, etc.)"
 *        '500':
 *          description: "Internal server error"
 *      security:
 *        - apiKey: []
 */
router.post("/register", registerController);

/**
 * Verificación de cuenta de usuario mediante token
 * @openapi
 * /api/v1/auth/verify_email:
 *    get:
 *      tags:
 *        - Users
 *      summary: "Verifica la cuenta de usuario mediante un token enviado por correo"
 *      description: "Permite verificar la cuenta de usuario haciendo clic en el enlace que contiene un token de verificación único enviado al correo del usuario."
 *      parameters:
 *        - in: query
 *          name: token
 *          required: true
 *          schema:
 *            type: string
 *          description: "Token de verificación único enviado al correo del usuario."
 *      responses:
 *        '200':
 *          description: "Cuenta verificada con éxito"
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Cuenta verificada con éxito. ¡Bienvenido, Juan!"
 *        '400':
 *          description: "Token faltante o inválido"
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Token faltante o inválido."
 *        '404':
 *          description: "Usuario no encontrado"
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Usuario no encontrado."
 *        '500':
 *          description: "Error interno del servidor al verificar el correo"
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Error al verificar la cuenta."
 *      security:
 *        - apiKey: []
 */
router.get("/verify_email", verifyEmailController);

/**
 * Solicitar recuperación de contraseña
 * @openapi
 * /api/v1/auth/forgot_password:
 *    post:
 *      tags:
 *        - Users
 *      summary: "Solicitar recuperación de contraseña"
 *      description: "Envía un código/token de recuperación de contraseña al correo del usuario. El código tiene una validez de 5 minutos desde su emisión."
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
 *                  example: "user@example.com"
 *                  description: "Correo electrónico registrado del usuario para el cual se solicitará la recuperación de la contraseña."
 *      responses:
 *        '200':
 *          description: "Instrucciones de recuperación enviadas con éxito"
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Si el correo existe, se enviarán instrucciones para la recuperación de contraseña."
 *        '400':
 *          description: "Correo electrónico no válido o no registrado"
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Correo electrónico no registrado en el sistema."
 *        '500':
 *          description: "Error interno del servidor al procesar la solicitud"
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: "Error al procesar la solicitud de recuperación de contraseña."
 *      security:
 *        - apiKey: []
 */
router.post("/forgot_password", forgotPasswordController);

/**
 * Verificar token de reseteo de contraseña
 * @openapi
 * /api/v1/auth/reset_password:
 *    get:
 *      tags:
 *        - Users
 *      summary: "Verificar token de reseteo de contraseña"
 *      description: "Verifica si el token de reseteo de contraseña es válido y no ha expirado. Este endpoint se utiliza para validar el token antes de permitir al usuario restablecer su contraseña."
 *      parameters:
 *        - in: query
 *          name: token
 *          required: true
 *          schema:
 *            type: string
 *          description: "Token de reseteo de contraseña único enviado al correo del usuario."
 *      responses:
 *        '200':
 *          description: "Token válido. El usuario puede proceder a restablecer su contraseña."
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Token válido. Procede a restablecer tu contraseña."
 *                  token:
 *                    type: string
 *                    description: "Token de reseteo válido para la siguiente etapa del proceso de recuperación de contraseña."
 *        '400':
 *          description: "Token inválido o expirado. El token ya no es válido para su uso."
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: "Token inválido o expirado."
 *        '404':
 *          description: "Usuario no encontrado asociado al token proporcionado."
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: "Usuario no encontrado para este token."
 *        '500':
 *          description: "Error interno del servidor al procesar la solicitud."
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: "Error al procesar la solicitud de verificación del token."
 *      security:
 *        - apiKey: []
 */
router.post("/reset_password", resetPasswordController);

export default router;
