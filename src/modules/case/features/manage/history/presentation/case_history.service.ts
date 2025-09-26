// src/modules/cases/features/manage/history/presentation/case_history.service.ts
import { GetCaseHistoryRepository } from "../data/case_history.repository";
import { AppError } from "../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { CASE_MESSAGES } from "../../../../../../constants/messages/case";
import { CaseStatusRepository } from "../../../shared/case_status/case_status.repository";

type CurrentUser = { id: string; role: "client" | "lawyer" };

export class GetCaseHistoryService {
  constructor(
    private readonly repo = new GetCaseHistoryRepository(),
    private readonly caseStatusRepo = new CaseStatusRepository()
  ) {}

  async execute(caseId: string, user: CurrentUser) {
    const participants = await this.caseStatusRepo.getCaseParticipants(caseId);
    if (!participants) {
      throw new AppError(
        CASE_MESSAGES.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );
    }

    const isOwner =
      (user.role === "client" && participants.client_id === user.id) ||
      (user.role === "lawyer" && participants.lawyer_id === user.id);

    if (!isOwner) {
      throw new AppError(
        CASE_MESSAGES.ACCESS_DENIED,
        HttpStatusCodes.FORBIDDEN.code
      );
    }

    const history = await this.repo.getHistoryByCaseId(caseId);
    if (!history.length) {
      throw new AppError(
        CASE_MESSAGES.HISTORY_NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );
    }
    return history;
  }
}
