// src/modules/cases/features/associations/attachments/archive/presentation/archive.service.ts
import { ArchiveAttachmentRepository } from "../data/archive.repository";
import { AppError } from "../../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../../constants/http_status_codes";
import { CASE_MESSAGES } from "../../../../../../../constants/messages/case";

type CurrentUser = { id: string; role: "client" | "lawyer" };

export class ArchiveAttachmentService {
  constructor(private readonly repo = new ArchiveAttachmentRepository()) {}

  async archive(caseId: string, attId: string, user: CurrentUser) {
    const caseData = await this.repo.findCaseById(caseId);
    if (!caseData)
      throw new AppError(
        CASE_MESSAGES.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );

    const { lawyer_id, client_id, id: service_id } = caseData.service;
    const isOwner =
      (user.role === "client" && client_id === user.id) ||
      (user.role === "lawyer" && lawyer_id === user.id);
    if (!isOwner)
      throw new AppError(
        CASE_MESSAGES.ACCESS_DENIED,
        HttpStatusCodes.FORBIDDEN.code
      );

    const found = await this.repo.findAttachmentByServiceIdAndId(
      attId,
      service_id
    );
    if (!found || found.archived)
      throw new AppError(
        CASE_MESSAGES.ATTACHMENT_NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );

    const updated = await this.repo.archiveAttachment(attId);
    await this.repo.createArchiveHistory(caseId, user.id, attId);
    return updated;
  }
}
