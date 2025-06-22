import { GetCaseHistoryRepository } from "../../data/case_history.repository";
import { AppError } from "../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { CASE_MESSAGES } from "../../../../../../constants/messages/case";

export class GetCaseHistoryService {
  constructor(private readonly repo = new GetCaseHistoryRepository()) {}

  async execute(caseId: number) {
    const history = await this.repo.getHistoryByCaseId(caseId);
    if (!history.length) {
      throw new AppError(CASE_MESSAGES.HISTORY_NOT_FOUND, HttpStatusCodes.NOT_FOUND.code);
    }
    return history;
  }
}
