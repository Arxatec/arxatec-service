// src/modules/case/features/associations/external_clients/update/presentation/update.routes.ts
import { Router, Request } from "express";
import multer from "multer";
import { authenticateToken } from "../../../../../../../middlewares/authenticate_token";
import { updateExternalClient } from "./update.controller";

export const router = Router();

const imageMimeTypes = ["image/jpeg", "image/jpg", "image/png"];
const fileFilter = (
  _: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) =>
  imageMimeTypes.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("ONLY_IMAGE_FILES_ALLOWED"));

const upload = multer({ storage: multer.memoryStorage(), fileFilter });

router.put(
  "/:id",
  authenticateToken,
  upload.single("avatar"),
  updateExternalClient
);
