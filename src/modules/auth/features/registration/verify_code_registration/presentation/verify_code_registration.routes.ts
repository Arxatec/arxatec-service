import { Router } from "express";
import { verifyCode } from "./verify_code_registration.controller";

export const router = Router();

router.post("/verify-code", verifyCode);
