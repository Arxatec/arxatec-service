import { Router } from "express";
import { getLawyersRoutes } from "./features/get_lawyers/presentation/get_lawyers.routes";

export const lawyerRouter = Router();

lawyerRouter.use("/", getLawyersRoutes);

export default lawyerRouter;
