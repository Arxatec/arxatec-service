import { Router } from "express";
import { DevController } from "../controllers/dev.controller";
import { asyncHandler } from "../../../../middlewares";

//Agrupa todos los endpoints relacionados con herramientas de desarrollo.

const router = Router();

router.post("/seed", asyncHandler(DevController.seedDatabase));

export default router;
