// src/modules/case/features/associations/external_clients/get_archived/presentation/get_archived.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../../middlewares/authenticate_token";
import { getArchived } from "./get_archived.controller";

export const router = Router();

router.get("/", authenticateToken, getArchived);
