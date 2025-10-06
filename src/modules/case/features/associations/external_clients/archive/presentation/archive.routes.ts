// src/modules/case/features/associations/external_clients/archive/presentation/archive.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../../middlewares/authenticate_token";
import { archive } from "./archive.controller";

export const router = Router();

router.patch("/:id", authenticateToken, archive);
