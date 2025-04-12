// src/modules/plans/presentation/services/plan.service.ts

import { PlanRepository } from "../../data/repository/plan.repository";
import { CreatePlanDTO } from "../../domain/dtos/create_plan.dto";
import { UpdatePlanDTO } from "../../domain/dtos/update_plan.dto";
import { PlanEntity } from "../../domain/entities/plan.entity";
import { AppError } from "../../../../utils";
import { MESSAGES, HttpStatusCodes } from "../../../../constants";

export class PlanService {
  constructor(private readonly planRepository: PlanRepository) {}

  public async createPlan(data: CreatePlanDTO): Promise<PlanEntity> {
    const newPlanEntity = await this.planRepository.createPlan(data);
    return newPlanEntity;
  }

  public async getAllPlans(): Promise<PlanEntity[]> {
    return this.planRepository.findAllPlans();
  }

  public async getPlanById(planId: number): Promise<PlanEntity> {
    const planEntity = await this.planRepository.findPlanById(planId);
    if (!planEntity) {
      throw new AppError(
        MESSAGES.PLANS.PLAN_NOT_FOUND,     
        HttpStatusCodes.NOT_FOUND.code       
      );
    }
    return planEntity;
  }

  public async updatePlan(planId: number, data: UpdatePlanDTO): Promise<PlanEntity> {
    const existingPlan = await this.planRepository.findPlanById(planId);
    if (!existingPlan) {
      throw new AppError(
        MESSAGES.PLANS.PLAN_NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );
    }

    return this.planRepository.updatePlan(planId, data);
  }

  public async deletePlan(planId: number): Promise<PlanEntity> {
    const existingPlan = await this.planRepository.findPlanById(planId);
    if (!existingPlan) {
      throw new AppError(
        MESSAGES.PLANS.PLAN_NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );
    }

    return this.planRepository.deletePlan(planId);
  }
}
