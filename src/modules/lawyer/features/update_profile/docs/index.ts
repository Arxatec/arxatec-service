/**
 * Update lawyer profile
 * @openapi
 * /lawyers/{id}:
 *   put:
 *     tags:
 *       - Lawyer
 *     summary: "Update lawyer profile"
 *     description: |
 *       Permite que un abogado actualice parcialmente su perfil profesional.
 *       Los campos `license_number`, `biography`, `experience`, `linkedin` y `specialty`
 *       son requeridos en el modelo, pero **no** en este endpoint (se asume que ya existen en BD).
 *       Si se omiten, se conservarán sus valores actuales.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del abogado a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+51987654321"
 *               profile_image:
 *                 type: string
 *                 format: uri
 *                 example: "https://s3.amazonaws.com/bucket/profile.jpg"
 *               linkedin:
 *                 type: string
 *                 format: uri
 *                 example: "https://www.linkedin.com/in/john-doe"
 *               license_number:
 *                 type: string
 *                 example: "C-23456"
 *               biography:
 *                 type: string
 *                 example: "Abogado especializado en derecho civil con 10 años de experiencia."
 *               experience:
 *                 type: integer
 *                 example: 10
 *               address:
 *                 type: string
 *                 example: "Av. Arequipa 1234, Lima"
 *               location_lat:
 *                 type: number
 *                 example: -12.0464
 *               location_lng:
 *                 type: number
 *                 example: -77.0428
 *     responses:
 *       '200':
 *         description: "Perfil del abogado actualizado correctamente"
 *       '401':
 *         description: "Unauthorized — token inválido o sesión expirada"
 *       '404':
 *         description: "Lawyer not found"
 *       '500':
 *         description: "Server Error"
 */
