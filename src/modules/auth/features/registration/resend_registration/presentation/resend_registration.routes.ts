import { Router } from "express";
import { resend } from "./resend_registration.controller";

export const router = Router();

router.post("/resend", resend);
