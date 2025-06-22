import { ReopenCaseDTO } from "../../domain/dtos/reopen_case.dto";
import { ReopenCaseRepository } from "../../data/reopen_case.repository";
import { AppError } from "../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { CASE_MESSAGES } from "../../../../../../constants/messages/case";

type User = { id: number; role: "client" | "lawyer" };

export class ReopenCaseService {
  constructor(private repo = new ReopenCaseRepository()) {}

  async execute(dto: ReopenCaseDTO, user: User) {
    const found = await this.repo.findCaseById(dto.id);
    if (!found) {
      throw new AppError(CASE_MESSAGES.NOT_FOUND, HttpStatusCodes.NOT_FOUND.code);
    }

    const clientId = found.service?.client_id;
    const lawyerId = found.service?.lawyer_id;

    const isAuthorized = clientId === user.id || lawyerId === user.id;
    if (!isAuthorized) {
      throw new AppError(CASE_MESSAGES.ACCESS_DENIED, HttpStatusCodes.FORBIDDEN.code);
    }

    if (!found.archived) {
      throw new AppError("Solo los casos archivados pueden reabrirse.", HttpStatusCodes.CONFLICT.code);
    }

    return this.repo.restoreCase(dto.id, user.id);
  }
}