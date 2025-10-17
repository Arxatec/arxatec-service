// src/modules/cases/features/manage/create_case/presentation/create_case.service.ts
import {
  CreateCaseRequest,
  CreateCaseResponse,
} from "../domain/create_case.payload";
import { AppError } from "../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { MESSAGES } from "../../../../../../constants/messages";
import {
  case_category,
  case_status,
  case_urgency,
  service_type,
} from "@prisma/client";
import {
  createService,
  createCase,
  findExternalClientByIdForLawyer,
} from "../data/create_case.repository";
import { getOpenAndTakenStatusIds } from "../../../shared/catalog/catalog.repository";
import {
  assertClientCanCreate,
  assertLawyerCanTake,
} from "../../../shared/capacity_policy/capacity_policy.service";

type CurrentUser = { id: string; role: "client" | "lawyer" };

export async function createCaseService(
  dto: CreateCaseRequest,
  user: CurrentUser
): Promise<CreateCaseResponse> {
  const { openStatusId, takenStatusId } = getOpenAndTakenStatusIds();

  if (user.role === "client") {
    await assertClientCanCreate(user.id);
  } else {
    await assertLawyerCanTake(user.id);
  }

  if (user.role === "lawyer") {
    if (!dto.external_client_id) {
      throw new AppError(
        MESSAGES.CASE.EXTERNAL_CLIENT_REQUIRED_FOR_LAWYER,
        HttpStatusCodes.FORBIDDEN.code
      );
    }
    const found = await findExternalClientByIdForLawyer(
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
  let status: case_status;

  if (user.role === "lawyer") {
    isPublic = false;
    assignedLawyerUserId = user.id;
    status = (dto.status as case_status) ?? takenStatusId;
  } else if (dto.selected_lawyer_id) {
    isPublic = false;
    assignedLawyerUserId = dto.selected_lawyer_id;
    status = (dto.status as case_status) ?? takenStatusId;
  } else {
    isPublic = true;
    assignedLawyerUserId = undefined;
    status = (dto.status as case_status) ?? openStatusId;
  }

  const service = await createService({
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

  const caseCreated = await createCase({
    service: { connect: { id: service.id } },
    title: dto.title,
    description: dto.description,
    category: dto.category as case_category,
    urgency: (dto.urgency ?? "medium") as case_urgency,
    status,
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
      category: caseCreated.category,
      status: caseCreated.status,
      urgency: caseCreated.urgency,
      is_public: caseCreated.is_public,
      reference_code: caseCreated.reference_code ?? undefined,
    },
  };
}
