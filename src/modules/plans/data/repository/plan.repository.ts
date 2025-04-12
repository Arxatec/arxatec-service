// src/modules/plans/data/repository/plan.repository.ts
import { PrismaClient } from "@prisma/client";
import { CreatePlanDTO } from "../../domain/dtos/create_plan.dto";
import { UpdatePlanDTO } from "../../domain/dtos/update_plan.dto";
import { PlanEntity } from "../../domain/entities/plan.entity";

export class PlanRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async createPlan(data: CreatePlanDTO): Promise<PlanEntity> {
    const { features, ...planData } = data;

    const plan = await this.prisma.plansClient.create({
      data: {
        ...planData,
        features: features
          ? {
              create: {
                ...features,
              },
            }
          : undefined,
      },
      include: { features: true },
    });

    return PlanEntity.fromPrisma(plan);
  }

  public async findAllPlans(): Promise<PlanEntity[]> {
    const plans = await this.prisma.plansClient.findMany({
      include: {
        features: true,
      },
    });

    return plans.map((plan) => PlanEntity.fromPrisma(plan));
  }

  public async findPlanById(planId: number): Promise<PlanEntity | null> {
    const plan = await this.prisma.plansClient.findUnique({
      where: { id: planId },
      include: { features: true },
    });

    return plan ? PlanEntity.fromPrisma(plan) : null;
  }

  public async updatePlan(planId: number, data: UpdatePlanDTO): Promise<PlanEntity> {
    const { features, ...planData } = data;

    const updatedPlan = await this.prisma.plansClient.update({
      where: { id: planId },
      data: {
        ...planData,
      },
      include: {
        features: true,
      },
    });

    if (features) {
      if (updatedPlan.features) {
        await this.prisma.planFeatures.update({
          where: { planId: planId },
          data: {
            ...features,
          },
        });
      } else {
        await this.prisma.planFeatures.create({
          data: {
            planId: planId,
            ...features,
          },
        });
      }
    }

    const planAfterUpdate = await this.prisma.plansClient.findUnique({
      where: { id: planId },
      include: { features: true },
    });

    if (!planAfterUpdate) {
      throw new Error("Plan not found after update");
    }

    return PlanEntity.fromPrisma(planAfterUpdate);
  }

  public async deletePlan(planId: number): Promise<PlanEntity> {
    const deleted = await this.prisma.plansClient.delete({
      where: { id: planId },
      include: { features: true },
    });

    return PlanEntity.fromPrisma(deleted);
  }
}
