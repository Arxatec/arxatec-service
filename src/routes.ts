import { Router } from "express";
import authRoutes from "./modules/user/presentation/routes/user.routes";
import emailRoutes from "./modules/user/presentation/routes/email.routes";
import waitlistRoutes from "./modules/waitlist/presentation/routes/waitlist.routes";
import clientRoutes from "./modules/client/presentation/routes/profile.routes";
import articleRoutes from "./modules/article/presentation/routes/article.routes";
import botRoutes from "./modules/bot/presentation/routes/bot.routes";
import formRoutes from "./modules/form/presentation/routes/form.routes";

const router = Router();
const API_VERSION = "/api/v1";

router.use(`${API_VERSION}/auth`, authRoutes);
router.use(`${API_VERSION}/email`, emailRoutes);
router.use(`${API_VERSION}/client`, clientRoutes);
router.use(`${API_VERSION}/articles`, articleRoutes);
router.use(`${API_VERSION}/chatbot`, botRoutes);
router.use(`${API_VERSION}/form`, formRoutes);
router.use(`${API_VERSION}`, waitlistRoutes);

export default router;
