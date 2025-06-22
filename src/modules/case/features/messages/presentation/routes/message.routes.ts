import { Router } from "express";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { MessageController } from "../controllers/message.controller";

const router = Router();
const controller = new MessageController();

router.post("/:id/messages", authenticateToken, asyncHandler(controller.send));

export { router as messageRoutes };