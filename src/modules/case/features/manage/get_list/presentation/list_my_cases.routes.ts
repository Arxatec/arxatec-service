// src/modules/cases/features/manage/list_my_cases/presentation/list_my_cases.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { handle } from "./list_my_cases.controller";

export const router = Router();

router.get("/", authenticateToken, handle);
