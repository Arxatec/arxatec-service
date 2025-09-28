import { Router } from "express";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { resend } from "./resend_registration.controller";

export const router = Router();

router.post("/resend", asyncHandler, resend);
