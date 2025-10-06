// src/modules/user/features/edit_profile/presentation/edit_profile.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../middlewares/authenticate_token";
import { edit } from "./edit_profile.controller";

export const router = Router();

router.put("/", authenticateToken, edit);
