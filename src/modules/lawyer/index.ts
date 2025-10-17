import { Router } from "express";
import { router as getLawyersRoutes } from "./features/get_lawyers/presentation/get_lawyers.routes";
import { router as getDetailRoutes } from "./features/get_detail/presentation/get_detail.routes";
import { router as updateProfileRoutes } from "./features/update_profile/presentation/update_profile.routes";

export const lawyerRouter = Router();

lawyerRouter.use("/list", getLawyersRoutes);
lawyerRouter.use("/detail", getDetailRoutes);
lawyerRouter.use("/", updateProfileRoutes);

export default lawyerRouter;
