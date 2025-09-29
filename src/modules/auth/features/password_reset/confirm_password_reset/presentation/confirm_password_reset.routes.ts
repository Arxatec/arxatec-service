import { Router } from "express";
import { confirm } from "./confirm_password_reset.controller";

export const router = Router();

router.post("/confirm", confirm);
