import { Router } from "express";
import authRoutes from "./modules/user/presentation/routes/user.routes";

const router = Router();

const API_VERSION = "/api/v1";

router.use(`${API_VERSION}/auth`, authRoutes);

export default router;
