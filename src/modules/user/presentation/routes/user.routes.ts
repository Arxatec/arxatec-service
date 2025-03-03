import { Router } from 'express';
import { registerController, loginController, forgotPasswordController, resetPasswordController  } from '../controllers/user.controller';
import { verifyEmailController } from "../controllers/email.controller";
const router = Router();
router.post('/login', loginController);
/*
  @openapi
  /api/v1//auth/login:
   post:
     tags:
       - Users
     summary: User login
     description: Authenticate a user and return a token if credentials are valid.
     requestBody:
       required: true
       content:
         application/json:
           schema:
             type: object
             required:
               - email
               - password
             properties:
               email:
                 type: string
                 format: email
                 example: "user@example.com"
               password:
                 type: string
                 format: password
                 example: "password123"
     responses:
       200:
         description: Successful login
         content:
           application/json:
             schema:
               type: object
               properties:
                 message:
                   type: string
                   example: "Login exitoso"
                 user:
                   $ref: '#/components/schemas/User'
                 token:
                   type: string
                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                   description: JWT token for authenticated requests.
       400:
         description: Invalid request body (extra fields, missing fields, etc.)
       401:
         description: Unauthorized - Invalid email or password
       500:
         description: Internal server error
 */

router.post('/register', registerController);
/*
  @openapi
  /api/v1//auth/register:
   post:
     tags:
       - Users
     summary: Register a new user
     description: Register a new user with the provided details.
     requestBody:
       required: true
       content:
         application/json:
           schema:
             type: object
             required:
               - email
               - password
               - first_name
               - last_name
               - user_type
             properties:
               email:
                 type: string
                 format: email
                 example: "user@example.com"
               password:
                 type: string
                 format: password
                 example: "password123"
               first_name:
                 type: string
                 example: "John"
               last_name:
                 type: string
                 example: "Doe"
               user_type:
                 type: string
                 enum: [client, lawyer]
                 example: "client"
               license_number:
                 type: string
                 example: "123456789"
                 description: Required only if user_type is "lawyer".
     responses:
       201:
         description: User registered successfully
         content:
           application/json:
             schema:
               type: object
               properties:
                 message:
                   type: string
                   example: "Usuario registrado exitosamente"
                 user:
                   $ref: '#/components/schemas/User'
       400:
         description: Invalid request body (extra fields, missing fields, etc.)
       500:
         description: Internal server error
 */
router.get("/verify_email", verifyEmailController);
/*
  @openapi
  /api/v1//auth/verify_email:
    get:
      tags:
        - Users
      summary: Verifica la cuenta de usuario mediante un token enviado por correo.
      description: Permite verificar la cuenta de usuario haciendo clic en un enlace enviado al correo.
      parameters:
        - in: query
          name: token
          required: true
          schema:
            type: string
          description: Token de verificación único enviado por correo.
      responses:
        200:
          description: Cuenta verificada con éxito.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Cuenta verificada con éxito. Bienvenido, Juan!"
        400:
          description: Token faltante o inválido.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Token faltante"
        404:
          description: Usuario no encontrado.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Usuario no encontrado"
        500:
          description: Error interno del servidor al verificar el correo.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Error al verificar la cuenta"
 */

                    router.post("/forgot_password", forgotPasswordController);
/*
  @openapi
  /api/v1/auth/forgot_password:
    post:
      tags:
        - Users
      summary: Solicitar recuperación de contraseña
      description: Envía un código/token de recuperación de contraseña al correo del usuario. El código expira en 5 minutos.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - email
              properties:
                email:
                  type: string
                  format: email
                  example: "user@example.com"
      responses:
        200:
          description: Instrucciones enviadas (mensaje genérico para seguridad).
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Si el correo existe, se enviarán instrucciones de recuperación."
        500:
          description: Error interno del servidor.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: "Error al procesar la solicitud"
*/

router.post("/reset_password", resetPasswordController);
/*
  @openapi
  /api/v1/auth/reset_password:
    get:
      tags:
        - Users
      summary: Verifica el token de reseteo de contraseña
      description: Verifica si el token de reseteo de contraseña es válido y no ha expirado.
      parameters:
        - in: query
          name: token
          required: true
          schema:
            type: string
          description: Token de reseteo de contraseña enviado por correo.
      responses:
        200:
          description: Token válido.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Token válido. Procede a restablecer tu contraseña."
                  token:
                    type: string
        400:
          description: Token inválido o expirado.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: "Token inválido o expirado"
*/

export default router;
