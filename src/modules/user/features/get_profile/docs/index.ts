// src/modules/user/features/get_profile/docs/index.ts
/**
 * Get user profile
 * @openapi
 * /user/profile:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     summary: "Get user profile"
 *     description: "Obtiene el perfil del usuario autenticado con información personal y de estado."
 *     responses:
 *       '200':
 *         description: "Perfil obtenido correctamente"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: number, example: 200 }
 *                 message: { type: string, example: "OK" }
 *                 path: { type: string, example: "/api/v1/user/profile" }
 *                 timestamp: { type: string, example: "2025-09-15T19:45:00.000Z" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: string, example: "84ea6d2a-d171-48d0-af0f-74c8a5b2eb29" }
 *                     first_name: { type: string, example: "Juan" }
 *                     last_name: { type: string, example: "Pérez" }
 *                     email: { type: string, format: email, example: "juan.perez@example.com" }
 *                     phone: { type: string, nullable: true, example: "+51 987654321" }
 *                     birth_date: { type: string, format: date, nullable: true, example: "1995-06-15" }
 *                     gender: { type: string, enum: [male, female, unspecified], example: "male" }
 *                     user_type: { type: string, enum: [admin, client, lawyer], example: "client" }
 *                     status: { type: string, enum: [active, suspended, pending], example: "active" }
 *                     admin_details:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         notes: { type: string, nullable: true, example: "Usuario en observación" }
 *       '401':
 *         description: "Unauthorized (token inválido o no enviado)"
 *       '500':
 *         description: "Internal Server Error"
 */
