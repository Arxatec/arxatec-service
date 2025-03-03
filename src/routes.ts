// routes.ts
import { Router } from "express";
import authRoutes from "./modules/user/presentation/routes/user.routes";
import passwordRoutes from "./modules/user/presentation/routes/user.routes";
import emailRoutes from "./modules/user/presentation/routes/email.routes";

const router = Router();
const API_VERSION = "/api/v1";

router.use(`${API_VERSION}/auth`, authRoutes);
router.use(`${API_VERSION}/email`, emailRoutes);
router.use(`${API_VERSION}/auth`, passwordRoutes);

export default router;
