// src/modules/cases/features/associations/attachments/list/presentation/list.routes.ts
import { Router } from "express";
import { asyncHandler } from "../../../../../../../middlewares/async_handler";
import { authenticateToken } from "../../../../../../../middlewares/authenticate_token";
import { ListAttachmentController } from "./list.controller";

const router = Router();
const controller = new ListAttachmentController();

router.get("/:id", authenticateToken, asyncHandler(controller.list));

export { router as listAttachmentRoutes };
