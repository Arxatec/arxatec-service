// src/modules/cases/features/manage/reopen_case/presentation/reopen_case.service.ts
import { AppError } from "../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { CASE_MESSAGES } from "../../../../../../constants/messages/case";
import { findCaseById, restoreCase } from "../data/reopen_case.repository";

type User = { id: string; role: "client" | "lawyer" };

export async function reopenCaseService(caseId: string, user: User) {
  const found = await findCaseById(caseId);
  if (!found)
    throw new AppError(CASE_MESSAGES.NOT_FOUND, HttpStatusCodes.NOT_FOUND.code);

  const clientId = found.service?.client_id ?? null;
  const lawyerId = found.service?.lawyer_id ?? null;
  const isAuthorized = clientId === user.id || lawyerId === user.id;
  if (!isAuthorized)
    throw new AppError(
      CASE_MESSAGES.ACCESS_DENIED,
      HttpStatusCodes.FORBIDDEN.code
    );

  if (!found.archived)
    throw new AppError(
      "ONLY_ARCHIVED_CASES_CAN_BE_REOPENED",
      HttpStatusCodes.CONFLICT.code
    );

  const updated = await restoreCase(caseId, user.id);
  return { id: updated.id, archived: updated.archived };
}
