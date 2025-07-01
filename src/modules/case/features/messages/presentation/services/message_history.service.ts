// src/modules/case/features/messages/services/message_history.service.ts
import { MessageRepository } from "../../data/message.repository";
import { AppError } from "../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { CASE_MESSAGES } from "../../../../../../constants/messages/case";

type CurrentUser = { id: number; role: "client" | "lawyer" };

export class MessageHistoryService {
  constructor(private readonly repo = new MessageRepository()) {}

  async getMessageHistory(caseId: number, user: CurrentUser) {
    const found = await this.repo.findCaseById(caseId);
    if (!found) {
      throw new AppError(CASE_MESSAGES.NOT_FOUND, HttpStatusCodes.NOT_FOUND.code);
    }

    const clientId = found.service?.client_id;
    const lawyerId = found.service?.lawyer_id;

    if (
      (user.role === "client" && clientId !== user.id) ||
      (user.role === "lawyer" && lawyerId !== user.id)
    ) {
      throw new AppError(CASE_MESSAGES.ACCESS_DENIED, HttpStatusCodes.FORBIDDEN.code);
    }

    const messages = await this.repo.getMessagesByCaseId(caseId);

    return messages;
  }
}
