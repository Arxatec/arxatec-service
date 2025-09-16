// src/modules/cases/features/associations/attachments/create/presentation/create.routes.ts
import { Router } from "express";
import multer from "multer";
import { asyncHandler } from "../../../../../../../middlewares/async_handler";
import { authenticateToken } from "../../../../../../../middlewares/authenticate_token";
import { CreateAttachmentController } from "./create.controller";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();
const controller = new CreateAttachmentController();

router.post(
  "/:id",
  authenticateToken,
  upload.single("file"),
  asyncHandler(controller.create)
);

export { router as createAttachmentRoutes };
