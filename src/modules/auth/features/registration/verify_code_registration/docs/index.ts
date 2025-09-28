/**
 * Verify registration code
 * @openapi
 * /auth/register/verify-code:
 *   post:
 *     tags:
 *       - Register
 *     summary: "Verify registration code"
 *     description: "Verifica el código enviado al correo para completar el registro y crear la cuenta."
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
 *                 example: "usuario@example.com"
 *               code:
 *                 type: string
 *                 minLength: 4
 *                 maxLength: 4
 *                 pattern: "^[0-9]{4}$"
 *                 example: "1234"
 *     responses:
 *       '201':
 *         description: "User verified and registered successfully"
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
 *                   example: "User verified and registered successfully"
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T19:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/register/verify-code"
 *       '400':
 *         description: "Bad Request (código inválido/expirado o datos temporales inválidos)"
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
 *                       example: "Código expirado o no encontrado, solicita uno nuevo."
 *                     - type: string
 *                       example: "Código inválido, solicita uno nuevo."
 *                     - type: string
 *                       example: "Datos temporales inválidos, solicita un nuevo código."
 *                     - type: string
 *                       example: "El correo electrónico es obligatorio"
 *                     - type: string
 *                       example: "El formato del correo electrónico no es válido, revisa que esté escrito correctamente"
 *                     - type: string
 *                       example: "El código de verificación es obligatorio"
 *                     - type: string
 *                       example: "El código de verificación debe tener exactamente 4 caracteres"
 *                     - type: string
 *                       example: "El código de verificación debe contener solo dígitos"
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T19:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/register/verify-code"
 *       '401':
 *         description: "Unauthorized (código incorrecto)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *                 description:
 *                   type: string
 *                   example: "Código de verificación inválido, por favor verifica que el código sea correcto."
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T19:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/register/verify-code"
 *       '409':
 *         description: "Conflict (correo ya registrado)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 409
 *                 message:
 *                   type: string
 *                   example: "Conflict"
 *                 description:
 *                   type: string
 *                   example: "El correo electrónico ya está registrado."
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T19:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/register/verify-code"
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
 *                       example: "Error creando usuario"
 *                     - type: string
 *                       example: "Error obteniendo código de verificación"
 *                     - type: string
 *                       example: "Error obteniendo datos temporales de usuario"
 *                     - type: string
 *                       example: "Error eliminando datos temporales"
 *                     - type: string
 *                       example: "Fallo inesperado en el proceso de verificación"
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T19:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/auth/register/verify-code"
 */
