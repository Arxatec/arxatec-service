import { Router } from "express";
import { NODE_ENV } from "./config/env";
import { authRouter } from "./modules/auth/auth.routes";
import emailRoutes from "./modules/email/presentation/routes/email.routes";
import waitlistRoutes from "./modules/waitlist/presentation/routes/waitlist.routes";
import articleRoutes from "./modules/article/presentation/routes/article.routes";
import articleCategoryRouter from "./modules/article/presentation/routes/article_category.routes";
import botRoutes from "./modules/bot/presentation/routes/bot.routes";
import formRoutes from "./modules/form/presentation/routes/form.routes";
import notificationRoutes from "./modules/notification/presentation/routes/notification.routes";
import lawyerRoutes from "./modules/lawyer/presentation/routes/lawyer.routes";
import clientRoutes from "./modules/client/presentation/routes/client.routes";
import communityRoutes from "./modules/community/presentation/routes/community.routes";
import calendarRoutes from "./modules/calendar/presentation/routes/calendar.routes";
import casesRoutes from "./modules/case/cases.routes";
import dashboardLawyerRouter from "./modules/dashboard/lawyer/presentation/routes/dashboardLawyer.routes";
import dashboardClientRouter from "./modules/dashboard/client/presentation/routes/dashboardClient.routes";
import userRoutes from "./modules/users/presentation/routes/user.routes";
import devRoutes from './modules/dev/presentation/routes/dev.routes';

const router = Router();
const API_VERSION = "/api/v1";

router.use(`${API_VERSION}/community`, communityRoutes);
router.use(`${API_VERSION}/auth`, authRouter);
router.use(`${API_VERSION}/email`, emailRoutes);
router.use(`${API_VERSION}/articles/categories`, articleCategoryRouter);
router.use(`${API_VERSION}/articles`, articleRoutes);
router.use(`${API_VERSION}/chatbot`, botRoutes);
router.use(`${API_VERSION}/lawyers`, lawyerRoutes);
router.use(`${API_VERSION}/clients`, clientRoutes);
router.use(`${API_VERSION}/form`, formRoutes);
router.use(`${API_VERSION}/`, waitlistRoutes);
router.use(`${API_VERSION}/notifications`, notificationRoutes);
router.use(`${API_VERSION}/calendar`, calendarRoutes);
router.use(`${API_VERSION}/cases`, casesRoutes);
router.use(`${API_VERSION}/dashboard`, dashboardLawyerRouter);
router.use(`${API_VERSION}/dashboard`, dashboardClientRouter);
router.use(`${API_VERSION}/users`, userRoutes);

// --- RUTAS PARA DESARROLLO ---
// Solo se activará si la variable de entorno NODE_ENV es 'development'.
if (NODE_ENV === 'development') {
  router.use(`${API_VERSION}/dev`, devRoutes);
}

export default router;