// src/modules/cases/features/associations/attachments/list/presentation/list.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../../middlewares/authenticate_token";
import { list } from "./list.controller";

export const router = Router();

router.get("/:id", authenticateToken, list);
