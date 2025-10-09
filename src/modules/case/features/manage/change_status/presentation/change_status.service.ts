// src/modules/cases/features/manage/change_status/presentation/change_status.service.ts
import { AppError } from "../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { MESSAGES } from "../../../../../../constants/messages";
import {
  findCaseById,
  countLawyerCasesByStatus,
  assignLawyerToService,
  unassignLawyerFromService,
  changeStatusTx,
} from "../data/change_status.repository";
import {
  ChangeStatusRequest,
  ChangeStatusResponse,
} from "../domain/change_status.schema";
import { case_status } from "@prisma/client";
import {
  getClosedStatusId,
  getOpenAndTakenStatusIds,
} from "../../../shared/catalog/catalog.repository";

type User = { id: string; role: "client" | "lawyer" };

const MAX_INPROGRESS_LAWYER = 5;

export async function changeStatusService(
  caseId: string,
  payload: ChangeStatusRequest,
  user: User
): Promise<ChangeStatusResponse> {
  const found = await findCaseById(caseId);
  if (!found) {
    throw new AppError(MESSAGES.CASE.NOT_FOUND, HttpStatusCodes.NOT_FOUND.code);
  }

  const { openStatusId, takenStatusId } = getOpenAndTakenStatusIds();
  const closedStatusId = getClosedStatusId();

  const current: case_status = found.status;
  const next: case_status = resolveNextEnum(payload.status);

  if (current === closedStatusId) {
    throw new AppError(
      MESSAGES.CASE.ALREADY_CLOSED,
      HttpStatusCodes.CONFLICT.code
    );
  }

  const order: case_status[] = [openStatusId, takenStatusId, closedStatusId];
  const idxCur = order.indexOf(current);
  const idxNext = order.indexOf(next);

  const isAdjacent =
    idxCur !== -1 && idxNext !== -1 && Math.abs(idxNext - idxCur) === 1;
  const isForward = idxNext - idxCur === 1;
  const isBackward = idxNext - idxCur === -1;

  if (user.role !== "lawyer" && !isForward) {
    throw new AppError(
      MESSAGES.CASE.NEXT_STATUS_ONLY,
      HttpStatusCodes.CONFLICT.code
    );
  }

  if (user.role === "lawyer" && !isAdjacent) {
    throw new AppError(
      MESSAGES.CASE.INVALID_TRANSITION_LAWYER,
      HttpStatusCodes.CONFLICT.code
    );
  }

  if (
    user.role === "lawyer" &&
    current === openStatusId &&
    next === takenStatusId
  ) {
    const count = await countLawyerCasesByStatus({
      lawyerId: user.id,
      status: takenStatusId,
      excludeExternal: true,
    });
    if (count >= MAX_INPROGRESS_LAWYER) {
      throw new AppError(
        MESSAGES.CASE.LIMIT_INPROGRESS_LAWYER,
        HttpStatusCodes.CONFLICT.code
      );
    }
  }

  if (user.role === "lawyer") {
    if (current === openStatusId && isForward && !found.service?.lawyer_id) {
      await assignLawyerToService(found.service_id, user.id);
    }
    if (current === takenStatusId && isBackward) {
      await unassignLawyerFromService(found.service_id);
    }
  }

  if (
    user.role === "lawyer" &&
    next === closedStatusId &&
    found.service?.lawyer_id !== user.id
  ) {
    throw new AppError(
      MESSAGES.CASE.CLOSE_ONLY_LAWYER,
      HttpStatusCodes.FORBIDDEN.code
    );
  }

  await changeStatusTx({
    caseId,
    newStatus: next,
    changedBy: user.id,
    oldStatus: current,
    note: payload.note,
  });

  return {
    message: MESSAGES.CASE.STATUS_CHANGED,
    status: humanizeStatus(next),
  };
}

function resolveNextEnum(statusIdAsUuid: string): case_status {
  if (Object.values(case_status).includes(statusIdAsUuid as case_status)) {
    return statusIdAsUuid as case_status;
  }
  throw new AppError("INVALID_STATUS", HttpStatusCodes.BAD_REQUEST.code);
}

function humanizeStatus(s: case_status): string {
  switch (s) {
    case "abierto":
      return "Abierto";
    case "en_progreso":
      return "En Progreso";
    case "cerrado":
      return "Cerrado";
    case "archivado":
      return "Archivado";
    default:
      return s;
  }
}
