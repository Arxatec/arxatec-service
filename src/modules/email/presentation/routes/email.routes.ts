// src/modules/email/presentation/routes/email.routes.ts
import { Router } from "express";
import { EmailController} from "../controllers/email.controller";

const emailController = new EmailController();
const router = Router();

router.post("/send-email", async (req, res, next) => {
    try {
      await emailController.sendVerificationEmail(req, res);
    } catch (error) {
      next(error);
    }
  });
  
  router.post("/verify-code", async (req, res, next) => {
    try {
      await emailController.verifyEmail(req, res);
    } catch (error) {
      next(error);
    }
  });

  router.post("/bulk_email", async (req, res, next) => {
    try {
      await emailController.sendBulkEmail(req, res);
    } catch (error) {
      next(error);
    }
  });
export default router;
