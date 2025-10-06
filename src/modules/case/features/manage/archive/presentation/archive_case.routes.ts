// src/modules/cases/features/manage/archive/presentation/archive_case.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { archive } from "./archive_case.controller";

export const router = Router();

router.patch("/:id", authenticateToken, archive);
