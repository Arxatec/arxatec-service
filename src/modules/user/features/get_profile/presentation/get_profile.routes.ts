// src/modules/user/features/get_profile/presentation/get_profile.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../middlewares/authenticate_token";
import { getProfile } from "./get_profile.controller";

export const router = Router();

router.get("/", authenticateToken, getProfile);
