import { Router } from "express";
import { request } from "./request_password_reset.controller";

export const router = Router();

router.post("/request", request);
