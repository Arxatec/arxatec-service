import { Router } from "express";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { verifyCode } from "./verify_code_password_reset.controller";

export const router = Router();

router.post("/verify-code", asyncHandler, verifyCode);
