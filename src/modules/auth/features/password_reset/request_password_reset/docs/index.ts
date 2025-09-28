/**
 * Request password reset
 * @openapi
 * /auth/password-reset/request:
 *   post:
 *     tags:
 *       - Forgot Password
 *     summary: "Request password reset"
 *     description: "Envía un código de verificación al correo electrónico del usuario para iniciar el proceso de restablecimiento de contraseña."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "usuario@example.com"
 *     responses:
 *       '200':
 *         description: "Verification code sent successfully"
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
 *                   example: "A verification code has been sent to your email"
 *                 description:
 *                   type: string
 *                   example: "Password reset code sent successfully"
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T19:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/password-reset/request"
 *       '400':
 *         description: "Bad Request (errores de validación Zod)"
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
 *                       example: "El correo electrónico es obligatorio"
 *                     - type: string
 *                       example: "El formato del correo electrónico no es válido, revisa que esté escrito correctamente"
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T19:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/password-reset/request"
 *       '404':
 *         description: "Not Found (usuario no existe)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Not Found"
 *                 description:
 *                   type: string
 *                   example: "El usuario no existe, por favor verifica que el correo electrónico sea correcto."
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T19:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/password-reset/request"
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
 *                       example: "Error al enviar el correo electrónico"
 *                     - type: string
 *                       example: "Error al generar la plantilla del correo"
 *                     - type: string
 *                       example: "Error al crear el código temporal"
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T19:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/password-reset/request"
 */
