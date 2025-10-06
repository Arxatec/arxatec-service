// src/modules/cases/features/manage/change_status/presentation/change_status.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { patch } from "./change_status.controller";

export const router = Router();


router.patch("/:id", authenticateToken, patch);
