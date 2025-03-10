import { Router } from "express";
import { BotController } from "../controllers/bot.controllers";
import { asyncHandler } from "../../../../middlewares/async_handler";

const router = Router();
const botController = new BotController();

router.post(
  "/send-message",
  asyncHandler((req, res) => botController.sendMessage(req, res))
);

export default router;
