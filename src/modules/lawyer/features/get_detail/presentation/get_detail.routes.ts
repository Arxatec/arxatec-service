// src/modules/lawyer/features/get_detail/presentation/get_detail.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../middlewares/authenticate_token";
import { getDetail } from "./get_detail.controller";

export const router = Router();

router.get("/:id", authenticateToken, getDetail);
