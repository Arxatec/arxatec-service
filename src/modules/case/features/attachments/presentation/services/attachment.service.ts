import { AttachmentRepository } from "../../data/attachment.repository";
import { AppError } from "../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { getSignedUrl } from "../../../../../../infrastructure/aws";
import { CASE_MESSAGES } from "../../../../../../constants/messages/case";
import { AddAttachmentDTO } from "../../domain/dtos/add_attachment.dto";
import { S3FileService } from "../../../shared/s3_file/s3_file.service";

type CurrentUser = { id: number; role: "client" | "lawyer" };

export class AttachmentService {
   constructor(
    private readonly repo = new AttachmentRepository(),
    private readonly s3 = new S3FileService()
  ) {}
 async add(caseId: number, dto: Omit<AddAttachmentDTO, "file_key">, file: Express.Multer.File, user: CurrentUser) {
    const caseData = await this.repo.findCaseById(caseId);
    if (!caseData) {
      throw new AppError(CASE_MESSAGES.NOT_FOUND, HttpStatusCodes.NOT_FOUND.code);
    }

    const { lawyer_id, client_id } = caseData.service;
    const isOwner =
      (user.role === "client" && client_id === user.id) ||
      (user.role === "lawyer" && lawyer_id === user.id);

    if (!isOwner) {
      throw new AppError(CASE_MESSAGES.ACCESS_DENIED, HttpStatusCodes.FORBIDDEN.code);
    }

    const uploaded = await this.s3.upload(file, "private/cases");

    const created = await this.repo.addAttachment({
      caseId,
      category_id: dto.category_id,
      label: dto.label,
      description: dto.description,
      file_key: uploaded.key,
      uploaded_by: user.role,
    });

    return { id: created.id, url: await this.s3.getUrl(uploaded.key) };
  }

  async list(caseId: number, user: CurrentUser) {
    const caseData = await this.repo.findCaseById(caseId);
    if (!caseData) {
      throw new AppError(
        CASE_MESSAGES.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );
    }

    const { lawyer_id, client_id } = caseData.service;

    const isOwner =
      (user.role === "client" && client_id === user.id) ||
      (user.role === "lawyer" && lawyer_id === user.id);

    if (!isOwner) {
      throw new AppError(
        CASE_MESSAGES.ACCESS_DENIED,
        HttpStatusCodes.FORBIDDEN.code
      );
    }

    const attachments = await this.repo.findAttachmentsByServiceId(caseId);

    return Promise.all(
      attachments.map(async (att) => ({
        id: att.id,
        label: att.label,
        description: att.description,
        category_id: att.category_id,
        uploaded_by: att.uploaded_by,
        created_at: att.created_at,
        url: await getSignedUrl(att.file_key),
      }))
    );
  }

  async archive(caseId: number, attId: number, user: CurrentUser) {
    const found = await this.repo.findAttachmentByServiceIdAndId(attId, caseId);
    if (!found || found.archived) {
      throw new AppError(
        CASE_MESSAGES.ATTACHMENT_NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );
    }
    return this.repo.archiveAttachment(attId, user.id);
  }
}
