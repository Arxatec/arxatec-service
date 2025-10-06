// src/modules/cases/features/associations/attachments/create/presentation/create.routes.ts
import { Router } from "express";
import multer from "multer";
import { authenticateToken } from "../../../../../../../middlewares/authenticate_token";
import { upload } from "./create.controller";

export const router = Router();
const m = multer({ storage: multer.memoryStorage() });

router.post("/:id", authenticateToken, m.single("file"), upload);
