import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller";
import { NotificationService } from "../services/notification.service";
import { NotificationRepository } from "../../data/repository/notification.repository";
import { authenticateToken } from "../../../../middlewares/authenticate_token";

const router = Router();

const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Operations about user notifications
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get all notifications for the authenticated user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a list of notifications for the user
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */
router.get("/", authenticateToken, async (req, res, next) => {
  try {
    await notificationController.getAll(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Create a new notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - type
 *               - receiverId
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
 *                 type: integer
 *                 example: 1
 *               senderId:
 *                 type: integer
 *                 example: 2
 *               url:
 *                 type: string
 *                 format: uri
 *                 example: "/messages/123"
 *     responses:
 *       201:
 *         description: Notification created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */
router.post("/", authenticateToken, async (req, res, next) => {
  try {
    await notificationController.create(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Delete a specific notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Notification ID to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notification deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notification not found or unauthorized
 */
router.delete("/:id", authenticateToken, async (req, res, next) => {
  try {
    await notificationController.delete(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
