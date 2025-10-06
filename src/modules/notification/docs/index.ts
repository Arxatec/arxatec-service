// src/modules/notification/features/manage_notification/docs/index.ts
/**
 * @openapi
 * /notifications:
 *   get:
 *     summary: Obtener notificaciones del usuario autenticado
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notificaciones
 *   post:
 *     summary: Crear una nueva notificación
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, type, receiverId]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Nuevo mensaje"
 *               description:
 *                 type: string
 *                 example: "Tienes un nuevo mensaje en tu bandeja"
 *               type:
 *                 type: string
 *                 enum: [info, success, error, alert]
 *               receiverId:
 *                 type: string
 *                 format: uuid
 *                 example: "8bdf7bd6-9c4f-4f84-9c8a-6f6a2a3b2d3f"
 *               senderId:
 *                 type: string
 *                 format: uuid
 *                 example: "1c6b3ff6-3a84-4d2e-9a2f-4fd3b8d9a111"
 *               url:
 *                 type: string
 *                 format: uri
 *                 example: "/messages/123"
 *     responses:
 *       201:
 *         description: Notificación creada
 * /notifications/{id}:
 *   delete:
 *     summary: Eliminar una notificación
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Notificación eliminada correctamente
 */
