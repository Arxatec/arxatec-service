import { ChangeStatusRepository } from "../../data/change_status.repository";
import { ChangeStatusDTO } from "../../domain/dtos/change_status.dto";
import { AppError } from "../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { MESSAGES } from "../../../../../../constants/messages";

type User = { id: number; role: "client" | "lawyer" };

export class ChangeStatusService {
  private readonly MAX_INPROGRESS_LAWYER = 5;

  constructor(private repo = new ChangeStatusRepository()) {}

  async execute(caseId: number, dto: ChangeStatusDTO, user: User) {
    const found = await this.repo.findCaseById(caseId);
    if (!found) {
      throw new AppError(
        MESSAGES.CASE.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );
    }

    const statuses = await this.repo.getAllStatuses();
    if (statuses.length < 3) {
      throw new AppError(
        "NEED_MIN_3_STATUSES",
        HttpStatusCodes.INTERNAL_SERVER_ERROR.code
      );
    }

    const current = statuses.find((s) => s.id === found.status_id)!;
    const next = statuses.find((s) => s.id === dto.status_id);

    if (!next) {
      throw new AppError("INVALID_STATUS", HttpStatusCodes.BAD_REQUEST.code);
    }

    const last = statuses[statuses.length - 1];
    const first = statuses[0];
    const taken = statuses[1];

    if (current.id === last.id) {
      throw new AppError(
        MESSAGES.CASE.ALREADY_CLOSED,
        HttpStatusCodes.CONFLICT.code
      );
    }

    const isForward = next.id === current.id + 1;
    const isBackward = next.id === current.id - 1;

    if (user.role !== "lawyer" && !isForward) {
      throw new AppError(
        MESSAGES.CASE.NEXT_STATUS_ONLY,
        HttpStatusCodes.CONFLICT.code
      );
    }

    if (user.role === "lawyer" && !isForward && !isBackward) {
      throw new AppError(
        MESSAGES.CASE.INVALID_TRANSITION_LAWYER,
        HttpStatusCodes.CONFLICT.code
      );
    }

    if (
      user.role === "lawyer" &&
      current.id === first.id &&
      next.id === taken.id
    ) {
      const count = await this.repo.countLawyerCasesByStatus({
        lawyerId: user.id,
        status_id: taken.id,
        excludeExternal: true,
      });

      if (count >= this.MAX_INPROGRESS_LAWYER) {
        throw new AppError(
          MESSAGES.CASE.LIMIT_INPROGRESS_LAWYER,
          HttpStatusCodes.CONFLICT.code
        );
      }
    }

    if (user.role === "lawyer") {
      if (current.id === first.id && isForward && !found.service?.lawyer_id) {
        await this.repo.assignLawyerToService(found.service_id, user.id);
      }

      if (current.id === taken.id && isBackward) {
        await this.repo.unassignLawyerFromService(found.service_id);
      }
    }

    if (
      user.role === "lawyer" &&
      next.id === last.id &&
      found.service?.lawyer_id !== user.id
    ) {
      throw new AppError(
        MESSAGES.CASE.CLOSE_ONLY_LAWYER,
        HttpStatusCodes.FORBIDDEN.code
      );
    }

    await this.repo.changeStatus(
      caseId,
      next.id,
      user.id,
      current.name,
      next.name,
      dto.note
    );

    return {
      message: MESSAGES.CASE.STATUS_CHANGED,
      status: next.name,
    };
  }
}
