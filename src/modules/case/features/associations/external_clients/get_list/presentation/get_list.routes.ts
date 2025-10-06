// src/modules/case/features/associations/external_clients/get_list/presentation/get_list.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../../middlewares/authenticate_token";
import { getExternalClients } from "./get_list.controller";

export const router = Router();

router.get("/", authenticateToken, getExternalClients);
