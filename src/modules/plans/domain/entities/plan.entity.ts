// src/modules/plans/domain/entities/plan.entity.ts

import { PlanFeaturesEntity } from "./plan_features.entity";

export class PlanEntity {
  public readonly id?: number;
  public name: string;
  public description?: string;
  public price: number;
  public features?: PlanFeaturesEntity;

  constructor(params: {
    id?: number;
    name: string;
    description?: string;
    price: number;
    features?: PlanFeaturesEntity;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.description = params.description;
    this.price = params.price;
    this.features = params.features;
  }

  public applyDiscount(percentage: number): void {
    const discount = (this.price * percentage) / 100;
    this.price = this.price - discount;
  }

  public static fromPrisma(plan: any): PlanEntity {
    return new PlanEntity({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      features: plan.features
        ? PlanFeaturesEntity.fromPrisma(plan.features)
        : undefined,
    });
  }
}
