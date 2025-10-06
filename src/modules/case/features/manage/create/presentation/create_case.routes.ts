// src/modules/cases/features/manage/create_case/presentation/create_case.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { create } from "./create_case.controller";

export const router = Router();

router.post("/", authenticateToken, create);
