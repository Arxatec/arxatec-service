/**
 * Verify password reset code
 * @openapi
 * /auth/password-reset/verify-code:
 *   post:
 *     tags:
 *       - Forgot Password
 *     summary: "Verify password reset code"
 *     description: "Verifica el código enviado al correo del usuario para el proceso de restablecimiento."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "usuario@ejemplo.com"
 *               code:
 *                 type: string
 *                 minLength: 4
 *                 maxLength: 4
 *                 pattern: "^[0-9]{4}$"
 *                 example: "1234"
 *     responses:
 *       '201':
 *         description: "Code verified successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Created"
 *                 description:
 *                   type: string
 *                   example: "Code verified successfully"
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T19:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/password-reset/verify-code"
 *       '400':
 *         description: "Bad Request (validación/flujo de verificación)"
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
 *                       example: "El código de verificación es obligatorio"
 *                     - type: string
 *                       example: "El código de verificación debe tener exactamente 4 caracteres"
 *                     - type: string
 *                       example: "El código de verificación debe contener solo dígitos"
 *                     - type: string
 *                       example: "El correo electrónico es obligatorio"
 *                     - type: string
 *                       example: "El formato del correo electrónico no es válido, revisa que esté escrito correctamente"
 *                     - type: string
 *                       example: "Se superó el máximo de intentos. Solicita un nuevo código."
 *                     - type: string
 *                       example: "Código no encontrado o expirado, solicita uno nuevo."
 *                     - type: string
 *                       example: "Código inválido, solicita uno nuevo."
 *                     - type: string
 *                       example: "Código inválido, verifica que sea correcto."
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T19:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/password-reset/verify-code"
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
 *                   example: "Error inesperado en el servidor"
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T19:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/password-reset/verify-code"
 */
