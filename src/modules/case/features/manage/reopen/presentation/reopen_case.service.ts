// src/modules/cases/features/manage/reopen_case/presentation/reopen_case.service.ts
import { ReopenCaseRepository } from "../data/reopen_case.repository";
import { ReopenCaseDTO } from "../domain/reopen_case.schema";
import { AppError } from "../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { CASE_MESSAGES } from "../../../../../../constants/messages/case";

type User = { id: string; role: "client" | "lawyer" };

export class ReopenCaseService {
  constructor(private repo = new ReopenCaseRepository()) {}

  async execute(dto: ReopenCaseDTO, user: User) {
    const found = await this.repo.findCaseById(dto.id);
    if (!found) {
      throw new AppError(
        CASE_MESSAGES.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );
    }

    const clientId = found.service?.client_id ?? null;
    const lawyerId = found.service?.lawyer_id ?? null;

    const isAuthorized = clientId === user.id || lawyerId === user.id;
    if (!isAuthorized) {
      throw new AppError(
        CASE_MESSAGES.ACCESS_DENIED,
        HttpStatusCodes.FORBIDDEN.code
      );
    }

    if (!found.archived) {
      throw new AppError(
        "ONLY_ARCHIVED_CASES_CAN_BE_REOPENED",
        HttpStatusCodes.CONFLICT.code
      );
    }

    return this.repo.restoreCase(dto.id, user.id);
  }
}
