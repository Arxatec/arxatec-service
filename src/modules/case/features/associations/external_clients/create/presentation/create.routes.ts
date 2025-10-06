// src/modules/case/features/associations/external_clients/create/presentation/create.routes.ts
import { Router, Request } from "express";
import multer from "multer";
import { authenticateToken } from "../../../../../../../middlewares/authenticate_token";
import { createExternalClient } from "./create.controller";

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

router.post(
  "/",
  authenticateToken,
  upload.single("avatar"),
  createExternalClient
);
