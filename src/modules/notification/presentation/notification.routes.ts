// src/modules/notification/features/notification/presentation/notification.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../middlewares/authenticate_token";
import { create, getAll, remove } from "./notification.controller";

export const router = Router();

router.get("/", authenticateToken, getAll);
router.post("/", authenticateToken, create);
router.delete("/:id", authenticateToken, remove);
