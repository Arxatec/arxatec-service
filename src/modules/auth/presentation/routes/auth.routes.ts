import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import {authenticateToken} from "../../../../middlewares/authenticate_token/"

const authController = new AuthController();
const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    await authController.register(req, res);
  } catch (error) {
    next(error);
  }
});

router.post("/verify-code", async (req, res, next) => {
  try {
    await authController.verifyCode(req, res);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    await authController.login(req, res);
  } catch (error) {
    next(error);
  }
});

router.post("/forgot-password", async (req, res, next) => {
  try {
    await authController.requestPasswordReset(req, res);
  } catch (error) {
    next(error);
  }
});

router.post("/reset-password", async (req, res, next) => {
  try {
    await authController.resetPassword(req, res);
  } catch (error) {
    next(error);
  }
});

router.post("/onboarding", authenticateToken, async (req, res, next) => {
  try {
    await authController.completeOnboarding(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
