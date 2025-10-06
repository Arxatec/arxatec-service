// src/modules/lawyer/features/get_lawyers/presentation/get_lawyers.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../middlewares/authenticate_token";
import { list } from "./get_lawyers.controller";

export const router = Router();

router.get("/", authenticateToken, list);
