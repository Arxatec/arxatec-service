// src/modules/plans/presentation/controllers/plan.controller.ts

import { Request, Response } from "express";
import { ZodError } from "zod";
import { PlanService } from "../services/plan.service";
import { CreatePlanSchema } from "../../domain/dtos/create_plan.dto";
import { UpdatePlanSchema } from "../../domain/dtos/update_plan.dto";
import { handleZodError, handleServerError } from "../../../../utils/error_handler";
import { buildHttpResponse } from "../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../constants";

export class PlanController {
  constructor(private readonly planService: PlanService) {}

  public async createPlan(req: Request, res: Response): Promise<Response> {
    try {
      const data = CreatePlanSchema.parse(req.body);

      // Call service to create plan
      const newPlan = await this.planService.createPlan(data);
      const responseBody = buildHttpResponse(
        HttpStatusCodes.CREATED.code,        
        "Plan created successfully",        
        req.path,                            
        newPlan                             
      );

      return res
        .status(HttpStatusCodes.CREATED.code)
        .json(responseBody);

    } catch (error) {
      if (error instanceof ZodError) {
        const zodErrorObject = handleZodError(error, req);
        return res
          .status(HttpStatusCodes.BAD_REQUEST.code)
          .json(zodErrorObject);
      }
      return handleServerError(res, req, error);
    }
  }

  public async getAllPlans(req: Request, res: Response): Promise<Response> {
    try {
      const plans = await this.planService.getAllPlans();

      const responseBody = buildHttpResponse(
        HttpStatusCodes.OK.code,            
        "Plans retrieved successfully",
        req.path,
        plans
      );

      return res
        .status(HttpStatusCodes.OK.code)
        .json(responseBody);

    } catch (error) {
      return handleServerError(res, req, error);
    }
  }

  public async getPlanById(req: Request, res: Response): Promise<Response> {
    try {
      const planId = parseInt(req.params.id, 10);
      const plan = await this.planService.getPlanById(planId);

      const responseBody = buildHttpResponse(
        HttpStatusCodes.OK.code,
        "Plan retrieved successfully",
        req.path,
        plan
      );

      return res
        .status(HttpStatusCodes.OK.code)
        .json(responseBody);

    } catch (error) {
      if (error instanceof ZodError) {
        const zodErrorObject = handleZodError(error, req);
        return res
          .status(HttpStatusCodes.BAD_REQUEST.code)
          .json(zodErrorObject);
      }
      return handleServerError(res, req, error);
    }
  }

  public async updatePlan(req: Request, res: Response): Promise<Response> {
    try {
      const planId = parseInt(req.params.id, 10);
      const data = UpdatePlanSchema.parse(req.body);

      const updatedPlan = await this.planService.updatePlan(planId, data);

      const responseBody = buildHttpResponse(
        HttpStatusCodes.OK.code,
        "Plan updated successfully",
        req.path,
        updatedPlan
      );

      return res
        .status(HttpStatusCodes.OK.code)
        .json(responseBody);

    } catch (error) {
      if (error instanceof ZodError) {
        const zodErrorObject = handleZodError(error, req);
        return res
          .status(HttpStatusCodes.BAD_REQUEST.code)
          .json(zodErrorObject);
      }
      return handleServerError(res, req, error);
    }
  }

  public async deletePlan(req: Request, res: Response): Promise<Response> {
    try {
      const planId = parseInt(req.params.id, 10);

      await this.planService.deletePlan(planId);

      const responseBody = buildHttpResponse(
        HttpStatusCodes.OK.code,
        "Plan successfully deleted",
        req.path
      );

      return res
        .status(HttpStatusCodes.OK.code)
        .json(responseBody);

    } catch (error) {
      if (error instanceof ZodError) {
        const zodErrorObject = handleZodError(error, req);
        return res
          .status(HttpStatusCodes.BAD_REQUEST.code)
          .json(zodErrorObject);
      }
      return handleServerError(res, req, error);
    }
  }
}
