// routes.ts
import { Router } from "express";
import authRoutes from "./modules/user/presentation/routes/user.routes";
import passwordRoutes from "./modules/user/presentation/routes/user.routes";
import emailRoutes from "./modules/user/presentation/routes/email.routes";
import articleRoutes from "./modules/article/presentation/routes/article.routes";

const router = Router();
const API_VERSION = "/api/v1";

router.use(`${API_VERSION}/auth`, authRoutes);
router.use(`${API_VERSION}/email`, emailRoutes);
router.use(`${API_VERSION}/auth`, passwordRoutes);
router.use(`${API_VERSION}/articles`, articleRoutes);

export default router;
