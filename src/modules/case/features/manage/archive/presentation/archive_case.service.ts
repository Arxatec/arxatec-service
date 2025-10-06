// src/modules/cases/features/manage/archive/presentation/archive_case.service.ts
import type {
  ArchiveCaseRequest,
  ArchiveCaseResponse,
} from "../domain/archive_case.dto";
import { findCaseLight } from "../data/archive_case.repository";
import { AppError } from "../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { CASE_MESSAGES } from "../../../../../../constants/messages/case";
import {
  getCaseParticipants,
  archiveCase,
} from "../../../shared/case_status/case_status.repository";

type User = { id: string; role: "client" | "lawyer" };

export async function archiveCaseService(
  dto: ArchiveCaseRequest,
  user: User
): Promise<ArchiveCaseResponse> {
  const found = await findCaseLight(dto.id);
  if (!found) {
    throw new AppError(CASE_MESSAGES.NOT_FOUND, HttpStatusCodes.NOT_FOUND.code);
  }

  const participants = await getCaseParticipants(dto.id);
  const clientId = participants?.client_id ?? null;
  const lawyerId = participants?.lawyer_id ?? null;

  const isAuthorized = clientId === user.id || lawyerId === user.id;
  if (!isAuthorized) {
    throw new AppError(
      CASE_MESSAGES.ACCESS_DENIED,
      HttpStatusCodes.FORBIDDEN.code
    );
  }

  if (found.archived) {
    throw new AppError(
      CASE_MESSAGES.ALREADY_ARCHIVED,
      HttpStatusCodes.CONFLICT.code
    );
  }

  await archiveCase(dto.id, user.id);

  return { message: CASE_MESSAGES.ARCHIVED_SUCCESS };
}
