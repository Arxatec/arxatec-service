import { Router } from "express";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { request } from "./request_registration.controller";

export const router = Router();

router.post("/request", asyncHandler, request);
