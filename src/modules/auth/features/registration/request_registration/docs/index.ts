/**
 * Request user registration
 * @openapi
 * /auth/register/request:
 *   post:
 *     tags:
 *       - Register
 *     summary: "Request user registration"
 *     description: "Inicia el registro de un nuevo usuario y envía un código de verificación al correo."
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
 *                 example: "Password123"
 *               confirm_password:
 *                 type: string
 *                 minLength: 8
 *                 example: "Password123"
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
 *                   example: "OK"
 *                 description:
 *                   type: string
 *                   example: "Verification code sent successfully."
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T19:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/register/request"
 *       '400':
 *         description: "Bad Request (validación/negocio)"
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
 *                   example: "Bad Request"
 *                 description:
 *                   type: string
 *                   oneOf:
 *                     - type: string
 *                       example: "El nombre es obligatorio"
 *                     - type: string
 *                       example: "El nombre debe tener al menos 2 caracteres"
 *                     - type: string
 *                       example: "El apellido es obligatorio"
 *                     - type: string
 *                       example: "El apellido debe tener al menos 2 caracteres"
 *                     - type: string
 *                       example: "El correo electrónico es obligatorio"
 *                     - type: string
 *                       example: "El formato del correo electrónico no es válido, revisa que esté escrito correctamente"
 *                     - type: string
 *                       example: "La contraseña es obligatoria"
 *                     - type: string
 *                       example: "La contraseña debe tener al menos 8 caracteres"
 *                     - type: string
 *                       example: "La confirmación de contraseña es obligatoria"
 *                     - type: string
 *                       example: "La confirmación de contraseña debe tener al menos 8 caracteres"
 *                     - type: string
 *                       example: "Las contraseñas no coinciden, vuelve a intentar por favor"
 *                     - type: string
 *                       example: "El correo electrónico ya está en uso, por favor verifica que el correo electrónico sea correcto."
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T19:30:00.000Z"
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
 *                       example: "Error creando usuario temporal"
 *                     - type: string
 *                       example: "Error al generar la plantilla del correo"
 *                     - type: string
 *                       example: "Error al enviar el correo de verificación"
 *                     - type: string
 *                       example: "Fallo inesperado en el proceso de registro"
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T19:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/register/request"
 */
