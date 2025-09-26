// src/modules/cases/features/manage/create_case/presentation/services/create_case.service.ts
import { CreateCaseDTO } from "../domain/create_case.dto";
import { CreateCaseRepository } from "../data/create_case.repository";
import { CatalogRepository } from "../../../shared/catalog/catalog.repository";
import { CapacityPolicyService } from "../../../shared/capacity_policy/capacity_policy.service";
import { AppError } from "../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { MESSAGES } from "../../../../../../constants/messages/";
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
    const { openStatusId, takenStatusId } =
      await this.catalog.getOpenAndTakenStatusIds();

    if (user.role === "client") {
      await this.policy.assertClientCanCreate(user.id);
    } else {
      await this.policy.assertLawyerCanTake(user.id);
    }

    if (user.role === "lawyer") {
      if (!dto.external_client_id) {
        throw new AppError(
          MESSAGES.CASE.EXTERNAL_CLIENT_REQUIRED_FOR_LAWYER,
          HttpStatusCodes.FORBIDDEN.code
        );
      }
      const found = await this.repo.findExternalClientByIdForLawyer(
        dto.external_client_id,
        user.id
      );
      if (!found) {
        throw new AppError(
          MESSAGES.CASE.EXTERNAL_CLIENT_NOT_FOUND,
          HttpStatusCodes.FORBIDDEN.code
        );
      }
    } else {
      if (dto.external_client_id) {
        throw new AppError(
          MESSAGES.CASE.EXTERNAL_CLIENT_NOT_ALLOWED_FOR_CLIENT,
          HttpStatusCodes.FORBIDDEN.code
        );
      }
    }

    let isPublic: boolean;
    let assignedLawyerUserId: string | undefined;
    let statusId: string;

    if (user.role === "lawyer") {
      isPublic = false;
      assignedLawyerUserId = user.id;
      statusId = dto.status_id ?? takenStatusId;
    } else if (dto.selected_lawyer_id) {
      isPublic = false;
      assignedLawyerUserId = dto.selected_lawyer_id;
      statusId = dto.status_id ?? takenStatusId;
    } else {
      isPublic = true;
      assignedLawyerUserId = undefined;
      statusId = dto.status_id ?? openStatusId;
    }

    const service = await this.repo.createService({
      type: service_type.case,
      ...(assignedLawyerUserId
        ? { lawyer: { connect: { user_id: assignedLawyerUserId } } }
        : {}),
      ...(user.role === "client"
        ? { client: { connect: { user_id: user.id } } }
        : {}),
      ...(user.role === "lawyer" && dto.external_client_id
        ? { external_client: { connect: { id: dto.external_client_id } } }
        : {}),
    });

    const caseCreated = await this.repo.createCase({
      service: { connect: { id: service.id } },
      title: dto.title,
      description: dto.description,
      category: { connect: { id: dto.category_id } },
      urgency: dto.urgency ?? "media",
      status: { connect: { id: statusId } },
      is_public: isPublic,
      reference_code: dto.reference_code,
    });

    return {
      message: MESSAGES.CASE.CREATED_SUCCESS,
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
