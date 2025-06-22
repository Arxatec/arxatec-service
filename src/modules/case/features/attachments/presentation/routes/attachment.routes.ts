import { Router } from "express";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { AttachmentController } from "../controllers/attachment.controller";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();
const controller = new AttachmentController();

router.post(
  "/:id/attachments",
  authenticateToken,
  upload.single("file"),
  asyncHandler(controller.add)
);
router.get(
  "/:id/attachments",
  authenticateToken,
  asyncHandler(controller.list)
);
router.patch(
  "/:id/attachments/:attId/archive",
  authenticateToken,
  asyncHandler(controller.archive)
);

export { router as attachmentRoutes };
