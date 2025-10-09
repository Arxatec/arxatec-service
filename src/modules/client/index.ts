import { Router } from "express";
import { router as getDetailRoutes } from "./features/get_detail/presentation/get_detail.routes";

export const clientRouter = Router();

clientRouter.use("/detail", getDetailRoutes);

export default clientRouter;
