import { Router } from "express";
import { authRouter } from "./modules/auth";
import { caseRouter } from "./modules/case";
import { userRouter } from "./modules/user";

const router = Router();
const API_VERSION = "/api/v1";

router.use(`${API_VERSION}/auth`, authRouter);
router.use(`${API_VERSION}/user`, userRouter);
router.use(`${API_VERSION}/cases`, caseRouter);

export default router;
