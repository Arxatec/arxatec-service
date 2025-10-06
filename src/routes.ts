// src/routes/index.ts
import { Router } from "express";
import { authRouter } from "./modules/auth";
import { caseRouter } from "./modules/case";
import { userRouter } from "./modules/user";
import { notificationRouter } from "./modules/notification";
import { lawyerRouter } from "./modules/lawyer/";
const router = Router();
const API_VERSION = "/api/v1";

router.use(`${API_VERSION}/auth`, authRouter);
router.use(`${API_VERSION}/user`, userRouter);
router.use(`${API_VERSION}/cases`, caseRouter);
router.use(`${API_VERSION}/lawyer`, caseRouter);
router.use(`${API_VERSION}/notifications`, notificationRouter);

export default router;
