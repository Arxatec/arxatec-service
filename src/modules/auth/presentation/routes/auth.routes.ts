// src/modules/auth/presentation/routes/auth.routes.ts

import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const authController = new AuthController();
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication module
 */
const router = Router();
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
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
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               confirm_password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Email already in use
 */
router.post("/register", async (req, res, next) => {
  try {
    await authController.register(req, res);
  } catch (error) {
    next(error);
  }
});
/**
 * @swagger
 * /auth/verify-code:
 *   post:
 *     summary: Verify user account with 4-digit code
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: User verified successfully
 *       400:
 *         description: Invalid or expired verification code
 */
router.post("/verify-code", async (req, res, next) => {
  try {
    await authController.verifyCode(req, res);
  } catch (error) {
    next(error);
  }
});
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", async (req, res, next) => {
  try {
    await authController.login(req, res);
  } catch (error) {
    next(error);
  }
});
/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
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
 *     responses:
 *       200:
 *         description: Password reset code sent to email
 *       403:
 *         description: User not verified
 */
router.post("/forgot-password", async (req, res, next) => {
  try {
    await authController.requestPasswordReset(req, res);
  } catch (error) {
    next(error);
  }
});
/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password with 4-digit code
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - new_password
 *               - confirm_password
 *             properties:
 *               code:
 *                 type: string
 *               new_password:
 *                 type: string
 *               confirm_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired code
 */
router.post("/reset-password", async (req, res, next) => {
  try {
    await authController.resetPassword(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
