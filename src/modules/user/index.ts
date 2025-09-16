// src/modules/user/index.ts
import { Router } from "express";
import { editProfileRoutes } from "./features/edit_profile";
import { getProfileRoutes } from "./features/get_profile/presentation/get_profile.routes";
import { listUsersRoutes } from "./features/list_users/presentation/list_users.routes";

export const router = Router();

router.use("/profile", editProfileRoutes);
router.use("/get-profile", getProfileRoutes);
router.use("/list", listUsersRoutes);

export { router as userRouter };
