import { Router } from "express";
import { confirm } from "./confirm_password_reset.controller";
import { asyncHandler } from "../../../../../../middlewares/async_handler";

export const router = Router();

router.post("/confirm", asyncHandler, confirm);
