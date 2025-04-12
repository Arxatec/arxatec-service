// src/modules/plans/domain/entities/plan_features.entity.ts

export class PlanFeaturesEntity {
  public readonly id?: number; 
  public planId?: number;

  // Feature toggles
  public caseManagement: boolean;
  public paymentsAndFinances: boolean;
  public communityAccess: boolean;
  public messagesAccess: boolean;
  public aiIntegration: boolean;

  // Feature limits
  public maxConsultationsPerMonth: number;
  public maxContractReviewsPerMonth: number;
  public maxVirtualMeetingsPerMonth: number;
  public maxRemindersPerMonth: number;

  // Extra features
  public prioritySupport: boolean;
  public exclusiveEvents: boolean;

  constructor(params: {
    id?: number;
    planId?: number;
    caseManagement?: boolean;
    paymentsAndFinances?: boolean;
    communityAccess?: boolean;
    messagesAccess?: boolean;
    aiIntegration?: boolean;
    maxConsultationsPerMonth?: number;
    maxContractReviewsPerMonth?: number;
    maxVirtualMeetingsPerMonth?: number;
    maxRemindersPerMonth?: number;
    prioritySupport?: boolean;
    exclusiveEvents?: boolean;
  }) {
    this.id = params.id;
    this.planId = params.planId;

    this.caseManagement = params.caseManagement ?? false;
    this.paymentsAndFinances = params.paymentsAndFinances ?? false;
    this.communityAccess = params.communityAccess ?? false;
    this.messagesAccess = params.messagesAccess ?? false;
    this.aiIntegration = params.aiIntegration ?? false;

    this.maxConsultationsPerMonth = params.maxConsultationsPerMonth ?? 0;
    this.maxContractReviewsPerMonth = params.maxContractReviewsPerMonth ?? 0;
    this.maxVirtualMeetingsPerMonth = params.maxVirtualMeetingsPerMonth ?? 0;
    this.maxRemindersPerMonth = params.maxRemindersPerMonth ?? 0;

    this.prioritySupport = params.prioritySupport ?? false;
    this.exclusiveEvents = params.exclusiveEvents ?? false;
  }

  public hasMeetingsAvailable(): boolean {
    return this.maxVirtualMeetingsPerMonth > 0;
  }

  // Example factory method: Build from a repository (Prisma) result
  public static fromPrisma(features: any): PlanFeaturesEntity {
    return new PlanFeaturesEntity({
      id: features.id,
      planId: features.planId,
      caseManagement: features.caseManagement,
      paymentsAndFinances: features.paymentsAndFinances,
      communityAccess: features.communityAccess,
      messagesAccess: features.messagesAccess,
      aiIntegration: features.aiIntegration,
      maxConsultationsPerMonth: features.maxConsultationsPerMonth,
      maxContractReviewsPerMonth: features.maxContractReviewsPerMonth,
      maxVirtualMeetingsPerMonth: features.maxVirtualMeetingsPerMonth,
      maxRemindersPerMonth: features.maxRemindersPerMonth,
      prioritySupport: features.prioritySupport,
      exclusiveEvents: features.exclusiveEvents,
    });
  }
}
