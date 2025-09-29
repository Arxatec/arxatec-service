import { Router } from "express";
import { login } from "./login_with_email.controller";

export const router = Router();

router.post("/", login);
