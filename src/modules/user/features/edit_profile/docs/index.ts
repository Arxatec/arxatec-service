/**
 * Edit user profile
 * @openapi
 * /user/profile:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     summary: "Edit user profile"
 *     description: "Permite al usuario autenticado actualizar su perfil (nombre, apellido, teléfono, fecha de nacimiento, género, contraseña)."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName: { type: string, minLength: 1, maxLength: 50, example: "Juan" }
 *               lastName: { type: string, minLength: 1, maxLength: 50, example: "Pérez" }
 *               phone: { type: string, minLength: 9, maxLength: 20, example: "+51 987654321" }
 *               birthDate: { type: string, format: date, example: "1995-06-15" }
 *               gender: { type: string, enum: [male, female, unspecified], example: "male" }
 *               password: { type: string, minLength: 8, example: "nuevaPassword123" }
 *               confirmPassword: { type: string, minLength: 8, example: "nuevaPassword123" }
 *     responses:
 *       '200': { description: "Perfil actualizado correctamente" }
 *       '400': { description: "Errores de validación" }
 *       '401': { description: "Unauthorized" }
 *       '500': { description: "Error interno del servidor" }
 */
