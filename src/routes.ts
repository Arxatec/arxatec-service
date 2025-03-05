// routes.ts
import { Router } from "express";
import authRoutes from "./modules/user/presentation/routes/user.routes";
import passwordRoutes from "./modules/user/presentation/routes/user.routes";
import emailRoutes from "./modules/user/presentation/routes/email.routes";
import SubNewRoutes from "./modules/sub_new/presentation/routes/sub_information.routes";
import clientRoutes from "./modules/client/presentation/routes/profile.routes";

const router = Router();
const API_VERSION = "/api/v1";

router.use(`${API_VERSION}/auth`, authRoutes);
router.use(`${API_VERSION}/auth`, passwordRoutes);

router.use(`${API_VERSION}/email`, emailRoutes);

router.use(`${API_VERSION}/news`, SubNewRoutes);

router.use(`${API_VERSION}/client`, clientRoutes);


export default router;
