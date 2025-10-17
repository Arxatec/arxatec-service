import { Router } from "express";
import { authenticateToken } from "../../../../../middlewares/authenticate_token";
import { update } from "./update_profile.controller";

export const router = Router();

router.put("/:id", authenticateToken, update);
