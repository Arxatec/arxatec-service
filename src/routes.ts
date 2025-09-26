//src/routes
import { Router } from "express";
import { authRouter } from "./modules/auth";
import { caseRouter } from "./modules/case";
import { waitlistRoute } from "./modules/waitlist";
import { userRouter } from "./modules/user";

const router = Router();
const API_VERSION = "/api/v1";

router.use(`${API_VERSION}/auth`, authRouter);
router.use(`${API_VERSION}/user`, userRouter);
router.use(`${API_VERSION}/cases`, caseRouter);
router.use(`${API_VERSION}/waitlist`, waitlistRoute);

export default router;
