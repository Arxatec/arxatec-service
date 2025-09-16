// src/modules/cases/features/manage/create_case/presentation/services/create_case.service.ts
import { CreateCaseDTO } from "../domain/create_case.dto";
import { CreateCaseRepository } from "../data/create_case.repository";
import { CatalogRepository } from "../../../shared/catalog/catalog.repository";
import { CapacityPolicyService } from "../../../shared/capacity_policy/capacity_policy.service";
import { AppError } from "../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { CASE_MESSAGES } from "../../../../../../constants/messages/case";
import { service_type } from "@prisma/client";

interface CurrentUser {
  id: string;
  role: "client" | "lawyer";
}

export class CreateCaseService {
  constructor(
    private readonly repo = new CreateCaseRepository(),
    private readonly catalog = new CatalogRepository(),
    private readonly policy = new CapacityPolicyService()
  ) {}

  async execute(dto: CreateCaseDTO, user: CurrentUser) {
    const statuses = await this.catalog.getAllStatuses();
    if (statuses.length < 2) {
      throw new AppError(
        "NEED_MIN_2_STATUSES",
        HttpStatusCodes.INTERNAL_SERVER_ERROR.code
      );
    }

    const initialStatusId = statuses[0].id;
    const takenStatusId = statuses[1].id;

    if (user.role === "client") {
      await this.policy.assertClientCanCreate(user.id);
    } else {
      await this.policy.assertLawyerCanTake(user.id);
    }

    if (dto.external_client_id) {
      const found = await this.repo.findExternalClientByIdForLawyer(
        dto.external_client_id,
        user.id
      );
      if (!found) {
        throw new AppError(
          CASE_MESSAGES.EXTERNAL_CLIENT_NOT_FOUND,
          HttpStatusCodes.FORBIDDEN.code
        );
      }
    }

    const status_id =
      dto.status_id ??
      (dto.selected_lawyer_id || user.role === "lawyer"
        ? takenStatusId
        : initialStatusId);

    const lawyer_id =
      dto.selected_lawyer_id ??
      (user.role === "lawyer" && dto.is_public === false ? user.id : undefined);

    const service = await this.repo.createService({
      type: service_type.case,
      ...(lawyer_id ? { lawyer: { connect: { user_id: lawyer_id } } } : {}),
      ...(user.role === "client"
        ? { client: { connect: { user_id: user.id } } }
        : {}),
      ...(dto.external_client_id
        ? { external_client: { connect: { id: dto.external_client_id } } }
        : {}),
    });

    const caseCreated = await this.repo.createCase({
      service: { connect: { id: service.id } },
      title: dto.title,
      description: dto.description,
      category: { connect: { id: dto.category_id } },
      urgency: dto.urgency ?? "media",
      status: { connect: { id: status_id } },
      is_public: dto.is_public ?? true,
      reference_code: dto.reference_code,
    });

    return {
      message: CASE_MESSAGES.CREATED_SUCCESS,
      case: {
        id: caseCreated.id,
        service_id: service.id,
        title: caseCreated.title,
        description: caseCreated.description,
        category_id: caseCreated.category_id,
        status_id: caseCreated.status_id,
        urgency: caseCreated.urgency,
        is_public: caseCreated.is_public,
        reference_code: caseCreated.reference_code ?? undefined,
      },
    };
  }
}
