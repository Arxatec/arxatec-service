/**
 * Update lawyer profile
 * @openapi
 * /users/{id}:
 *   put:
 *     tags:
 *       - Lawyer
 *     summary: "Update lawyer profile"
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone: { type: string, example: "+51987654321" }
 *               profile_image: { type: string, format: uri }
 *               linkedin: { type: string, example: "https://www.linkedin.com/in/john-doe" }
 *               license_number: { type: string, example: "C-23456" }
 *               address: { type: string, example: "Av. Arequipa 1234, Lima" }
 *               location_lat: { type: number, example: -12.0464 }
 *               location_lng: { type: number, example: -77.0428 }
 *               biography: { type: string, example: "Abogado especializado en derecho civil con 10 años de experiencia." }
 *               experience: { type: integer, example: 10 }
 *     responses:
 *       '200':
 *         description: Perfil actualizado correctamente
 *       '404':
 *         description: Abogado no encontrado
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Server Error
 */
