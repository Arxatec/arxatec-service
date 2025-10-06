// src/modules/cases/features/manage/update_case/presentation/update_case.service.ts
import { UpdateCaseRequest } from "../domain/update_case.schema";
import { AppError } from "../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { MESSAGES } from "../../../../../../constants/messages";
import {
  getCaseById,
  lawyerOwnsExternalClient,
  updateCaseAtomic,
} from "../data/update_case.repository";
import {
  getOpenAndTakenStatusIds,
  getClosedStatusId,
} from "../../../shared/catalog/catalog.repository";
import { assertLawyerCanTake } from "../../../shared/capacity_policy/capacity_policy.service";

type CurrentUser = { id: string; role: "client" | "lawyer" };

export async function updateCaseService(
  id: string,
  dto: UpdateCaseRequest,
  user: CurrentUser
) {
  const found = await getCaseById(id);
  if (!found)
    throw new AppError(MESSAGES.CASE.NOT_FOUND, HttpStatusCodes.NOT_FOUND.code);
  if (found.archived)
    throw new AppError(
      MESSAGES.CASE.CANNOT_EDIT_ARCHIVED,
      HttpStatusCodes.CONFLICT.code
    );

  const closed = getClosedStatusId();
  if (found.status === closed)
    throw new AppError(
      MESSAGES.CASE.CANNOT_EDIT_CLOSED,
      HttpStatusCodes.CONFLICT.code
    );

  const isOwner =
    (user.role === "client" && found.service?.client_id === user.id) ||
    (user.role === "lawyer" && found.service?.lawyer_id === user.id);
  if (!isOwner)
    throw new AppError(
      MESSAGES.CASE.ACCESS_DENIED,
      HttpStatusCodes.FORBIDDEN.code
    );

  if (user.role === "client" && dto.external_client_id)
    throw new AppError(
      MESSAGES.CASE.EXTERNAL_CLIENT_NOT_ALLOWED_FOR_CLIENT,
      HttpStatusCodes.FORBIDDEN.code
    );
  if (user.role === "lawyer" && dto.selected_lawyer_id)
    throw new AppError(
      MESSAGES.CASE.LAWYER_CANNOT_CHANGE_ASSIGNED_LAWYER,
      HttpStatusCodes.FORBIDDEN.code
    );

  const willMakePrivateAndTaken =
    user.role === "client" &&
    dto.selected_lawyer_id !== undefined &&
    found.is_public === true &&
    !found.service?.lawyer_id;

  if (willMakePrivateAndTaken && dto.selected_lawyer_id) {
    await assertLawyerCanTake(dto.selected_lawyer_id);
  }

  let newExternalClientId: string | undefined;
  if (user.role === "lawyer" && dto.external_client_id) {
    const ok = await lawyerOwnsExternalClient(dto.external_client_id, user.id);
    if (!ok)
      throw new AppError(
        MESSAGES.CASE.EXTERNAL_CLIENT_NOT_FOUND,
        HttpStatusCodes.FORBIDDEN.code
      );
    newExternalClientId = dto.external_client_id;
  }

  const updatesCase: any = {
    ...(dto.title !== undefined && { title: dto.title }),
    ...(dto.description !== undefined && { description: dto.description }),
    ...(dto.urgency !== undefined && { urgency: dto.urgency }),
    ...(dto.reference_code !== undefined && {
      reference_code: dto.reference_code,
    }),
    ...(dto.category !== undefined && { category: dto.category }),
  };

  const { takenStatusId } = getOpenAndTakenStatusIds();

  const updated = await updateCaseAtomic({
    caseId: found.id,
    serviceId: found.service!.id,
    updatesCase,
    assignLawyerUserId: willMakePrivateAndTaken
      ? dto.selected_lawyer_id
      : undefined,
    externalClientId: newExternalClientId,
    makePrivateAndTaken: willMakePrivateAndTaken,
    takenStatus: willMakePrivateAndTaken ? takenStatusId : undefined,
  });

  return {
    id: updated.id,
    service_id: found.service!.id,
    title: updated.title,
    description: updated.description,
    category: updated.category,
    status: updated.status,
    urgency: updated.urgency,
    is_public: updated.is_public,
    reference_code: updated.reference_code ?? null,
  };
}
