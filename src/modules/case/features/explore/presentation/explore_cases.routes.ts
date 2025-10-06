// src/modules/case/features/explore_cases/presentation/explore_cases.routes.ts
import { Router } from "express";
import { explore } from "./explore_cases.controller";

export const router = Router();
router.get("/", explore);
