import { Router } from "express";
import authRoutes from "./modules/auth/presentation/routes/auth.routes";
import emailRoutes from "./modules/email/presentation/routes/email.routes";
import waitlistRoutes from "./modules/waitlist/presentation/routes/waitlist.routes";
import articleRoutes from "./modules/article/presentation/routes/article.routes";
import botRoutes from "./modules/bot/presentation/routes/bot.routes";
import planRoutes from "./modules/plans/presentation/routes/plan.routes";
import notificationRoutes from "./modules/notification/presentation/routes/notification.routes";
const router = Router();
const API_VERSION = "/api/v1";


router.use(`${API_VERSION}/plans`, planRoutes);
router.use(`${API_VERSION}/auth`, authRoutes);
router.use(`${API_VERSION}/email`, emailRoutes);
router.use(`${API_VERSION}/articles`, articleRoutes);
router.use(`${API_VERSION}/chatbot`, botRoutes);
router.use(`${API_VERSION}/`, waitlistRoutes);
router.use(`${API_VERSION}/notifications`, notificationRoutes);

export default router;
