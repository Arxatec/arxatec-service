import { Router } from "express";
import { authRouter } from "./modules/auth/index";

const router = Router();
const API_VERSION = "/api/v1";

router.use(`${API_VERSION}/auth`, authRouter);

export default router;
