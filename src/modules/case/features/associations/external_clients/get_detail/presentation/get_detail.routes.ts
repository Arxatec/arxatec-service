// src/modules/case/features/associations/external_clients/get_detail/presentation/get_detail.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../../middlewares/authenticate_token";
import { getExternalClientDetail } from "./get_detail.controller";

export const router = Router();

router.get("/:id", authenticateToken, getExternalClientDetail);
