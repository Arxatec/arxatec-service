// src/modules/user/features/list_users/presentation/list_users.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../middlewares/authenticate_token";
import { list } from "./list_users.controller";

export const router = Router();

router.get("/", authenticateToken, list);
