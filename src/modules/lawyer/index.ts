import { Router } from "express";
import { router as getLawyersRoutes } from "./features/get_lawyers/presentation/get_lawyers.routes";

export const lawyerRouter = Router();

lawyerRouter.use("/list", getLawyersRoutes);

export default lawyerRouter;
