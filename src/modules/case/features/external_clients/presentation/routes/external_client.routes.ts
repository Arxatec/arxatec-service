// src/modules/cases/external_clients/presentation/routes/external_clients.routes.ts
import { Router, Request } from "express";
import multer from "multer";

import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { ExternalClientsController } from "../controller/external_client.controller";

const router = Router();
const ctrl = new ExternalClientsController();

const imageMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

const fileFilter = (
  _: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!imageMimeTypes.includes(file.mimetype)) {
    return cb(new Error("ONLY_IMAGE_FILES_ALLOWED"));
  }
  return cb(null, true);
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
});

// ───────────── RUTAS ─────────────
router.post(
  "/",
  authenticateToken,
  upload.single("avatar"),
  asyncHandler(ctrl.create.bind(ctrl))
);

router.get("/", authenticateToken, asyncHandler(ctrl.list.bind(ctrl)));

router.put(
  "/:id",
  authenticateToken,
  upload.single("avatar"),
  asyncHandler(ctrl.update.bind(ctrl))
);

router.patch(
  "/:id/archive",
  authenticateToken,
  asyncHandler(ctrl.archive.bind(ctrl))
);

router.get(
  "/archived",
  authenticateToken,
  asyncHandler(ctrl.listArchived.bind(ctrl))
);

router.patch(
  "/:id/restore",
  authenticateToken,
  asyncHandler(ctrl.restore.bind(ctrl))
);

export { router as externalClientsRoutes };
