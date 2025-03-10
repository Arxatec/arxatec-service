import { Router } from "express";
import { asyncHandler } from "../../../../middlewares";
import { FormController } from "../controllers/form.controller";

const router = Router();
const formController = new FormController()

router.post("/support", asyncHandler((req, res) => formController.submitForm(req, res)));

export default router;