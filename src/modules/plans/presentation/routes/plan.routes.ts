import { Router } from "express";
import { PlanRepository } from "../../data/repository/plan.repository";
import { PlanService } from "../services/plan.service";
import { PlanController } from "../controllers/plan.controller";
import { asyncHandler } from "../../../../middlewares";

const router = Router();

const planRepository = new PlanRepository();
const planService = new PlanService(planRepository);
const planController = new PlanController(planService);

router.post("/create", asyncHandler(planController.createPlan.bind(planController)));
router.get("/all", asyncHandler(planController.getAllPlans.bind(planController)));
router.get("/:id", asyncHandler(planController.getPlanById.bind(planController)));
router.put("/update/:id", asyncHandler(planController.updatePlan.bind(planController)));
router.delete("/delete/:id", asyncHandler(planController.deletePlan.bind(planController)));

export default router;
