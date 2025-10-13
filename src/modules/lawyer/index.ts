import { Router } from "express";
import { router as getLawyersRoutes } from "./features/get_lawyers/presentation/get_lawyers.routes";
import { router as getDetailRoutes } from "./features/get_detail/presentation/get_detail.routes";

export const lawyerRouter = Router();

lawyerRouter.use("/list", getLawyersRoutes);
lawyerRouter.use("/detail", getDetailRoutes);

export default lawyerRouter;
