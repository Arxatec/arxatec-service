import { Router } from "express";
import { authRouter } from "./modules/auth/auth.routes";
import emailRoutes from "./modules/email/presentation/routes/email.routes";
import waitlistRoutes from "./modules/waitlist/presentation/routes/waitlist.routes";
import articleRoutes from "./modules/article/presentation/routes/article.routes";
import botRoutes from "./modules/bot/presentation/routes/bot.routes";
import formRoutes from "./modules/form/presentation/routes/form.routes";
import notificationRoutes from "./modules/notification/presentation/routes/notification.routes";
import lawyerRoutes from "./modules/lawyer/presentation/routes/lawyer.routes";
import clientRoutes from "./modules/client/presentation/routes/client.routes";
import communityRoutes from "./modules/community/presentation/routes/community.routes";

const router = Router();
const API_VERSION = "/api/v1";

router.use(`${API_VERSION}/community`, communityRoutes);
router.use(`${API_VERSION}/auth`, authRouter);
router.use(`${API_VERSION}/email`, emailRoutes);
router.use(`${API_VERSION}/articles`, articleRoutes);
router.use(`${API_VERSION}/chatbot`, botRoutes);
router.use(`${API_VERSION}/lawyers`, lawyerRoutes);
router.use(`${API_VERSION}/clients`, clientRoutes);
router.use(`${API_VERSION}/form`, formRoutes);
router.use(`${API_VERSION}/`, waitlistRoutes);
router.use(`${API_VERSION}/notifications`, notificationRoutes);

export default router;
