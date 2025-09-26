// src/modules/case/features/associations/external_clients/create/presentation/create.routes.ts
import { Router, Request } from "express";
import multer from "multer";
import { authenticateToken } from "../../../../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../../../../middlewares/async_handler";
import { CreateExternalClientController } from "./create.controller";

const router = Router();
const ctrl = new CreateExternalClientController();

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
) =>
  imageMimeTypes.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("ONLY_IMAGE_FILES_ALLOWED"));
const upload = multer({ storage: multer.memoryStorage(), fileFilter });

router.post(
  "/",
  authenticateToken,
  upload.single("avatar"),
  asyncHandler((req, res) => ctrl.createExternalClient(req, res))
);

export default router;
