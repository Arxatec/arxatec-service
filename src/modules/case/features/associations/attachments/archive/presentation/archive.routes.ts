// src/modules/cases/features/associations/attachments/archive/presentation/archive.routes.ts
import { Router } from "express";
import { asyncHandler } from "../../../../../../../middlewares/async_handler";
import { authenticateToken } from "../../../../../../../middlewares/authenticate_token";
import { ArchiveAttachmentController } from "./archive.controller";

const router = Router();
const controller = new ArchiveAttachmentController();

router.patch(
  "/:id/archive/:attId ",
  authenticateToken,
  asyncHandler(controller.archive)
);

export { router as archiveAttachmentRoutes };
