import { Router } from "express";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { login } from "./login_with_email.controller";

export const router = Router();

router.post("/", asyncHandler, login);
