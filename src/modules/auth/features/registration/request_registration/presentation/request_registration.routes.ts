import { Router } from "express";
import { request } from "./request_registration.controller";

export const router = Router();

router.post("/request", request);
