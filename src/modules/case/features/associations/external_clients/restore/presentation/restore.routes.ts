// src/modules/case/features/associations/external_clients/restore/presentation/restore.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../../middlewares/authenticate_token";
import { restoreExternalClient } from "./restore.controller";

export const router = Router();

router.patch("/:id", authenticateToken, restoreExternalClient);
