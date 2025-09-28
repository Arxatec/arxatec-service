import { Router } from "express";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { request } from "./request_password_reset.controller";

export const router = Router();

router.post("/request", asyncHandler, request);
