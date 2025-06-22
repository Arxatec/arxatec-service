import { CaseDetailRepository } from "../../data/case_detail.repository";
import { AppError } from "../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { CASE_MESSAGES } from "../../../../../../constants/messages/case";
import { CaseDetailEntity } from "../../domain/entities/case_detail.entity";

type CurrentUser = { id: number; role: "client" | "lawyer" };

export class CaseDetailService {
  constructor(private readonly repo = new CaseDetailRepository()) {}

  async execute(id: number, user: CurrentUser): Promise<CaseDetailEntity> {
    const found = await this.repo.getById(id);

    if (!found) {
      throw new AppError(CASE_MESSAGES.NOT_FOUND, HttpStatusCodes.NOT_FOUND.code);
    }

    const isOwner =
      (user.role === "client" && found.service?.client_id === user.id) ||
      (user.role === "lawyer" && found.service?.lawyer_id === user.id);

    if (!isOwner) {
      throw new AppError(CASE_MESSAGES.ACCESS_DENIED, HttpStatusCodes.FORBIDDEN.code);
    }

    return found;
  }
}
