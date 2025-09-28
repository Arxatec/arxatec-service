import { Router } from "express";
import { verifyCode } from "./verify_code_registration.controller";
import { asyncHandler } from "../../../../../../middlewares/async_handler";

export const router = Router();

router.post("/verify-code", asyncHandler, verifyCode);
