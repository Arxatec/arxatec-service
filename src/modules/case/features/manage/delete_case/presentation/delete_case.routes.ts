// src/modules/cases/features/manage/delete_case/presentation/delete_case.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { remove } from "./delete_case.controller";

export const router = Router();

router.delete("/:case_id", authenticateToken, remove);
