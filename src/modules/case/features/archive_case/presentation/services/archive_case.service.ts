import { ArchiveCaseDTO } from "../../domain/dtos/archive_case.dto";
import { ArchiveCaseRepository } from "../../data/archive_case.repository";
import { AppError } from "../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { CASE_MESSAGES } from "../../../../../../constants/messages/case";
import { CaseStatusRepository } from "../../../shared/case_status/case_status.repository";

type User = { id: number; role: "client" | "lawyer" };

export class ArchiveCaseService {
  constructor(
    private readonly repo = new ArchiveCaseRepository(),
    private readonly statusRepo = new CaseStatusRepository()
  ) {}

  async execute(dto: ArchiveCaseDTO, user: User) {
    const found = await this.repo.findCaseLight(dto.id);
    if (!found) {
      throw new AppError(CASE_MESSAGES.NOT_FOUND, HttpStatusCodes.NOT_FOUND.code);
    }

    const participants = await this.statusRepo.getCaseParticipants(dto.id);
    const clientId = participants?.client_id;
    const lawyerId = participants?.lawyer_id;

    const isAuthorized = clientId === user.id || lawyerId === user.id;
    if (!isAuthorized) {
      throw new AppError(CASE_MESSAGES.ACCESS_DENIED, HttpStatusCodes.FORBIDDEN.code);
    }

    if (found.archived) {
      throw new AppError(CASE_MESSAGES.ALREADY_ARCHIVED, HttpStatusCodes.CONFLICT.code);
    }

    await this.statusRepo.archive(dto.id, user.id);

    return { message: CASE_MESSAGES.ARCHIVED_SUCCESS };
  }
}
