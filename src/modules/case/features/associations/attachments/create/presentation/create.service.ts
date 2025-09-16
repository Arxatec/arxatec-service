// src/modules/cases/features/associations/attachments/create/presentation/create.service.ts
import { CreateAttachmentRepository } from "../data/create.repository";
import { AppError } from "../../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../../constants/http_status_codes";
import { CASE_MESSAGES } from "../../../../../../../constants/messages/case";
import { CreateAttachmentDTO } from "../domain/create.dto";
import { S3FileService } from "../../../../shared/s3_file/s3_file.service";

type CurrentUser = { id: string | number; role: "client" | "lawyer" };

export class CreateAttachmentService {
  constructor(
    private readonly repo = new CreateAttachmentRepository(),
    private readonly s3 = new S3FileService()
  ) {}

  async create(
    caseId: string,
    dto: Omit<CreateAttachmentDTO, "file_key">,
    file: Express.Multer.File,
    user: CurrentUser
  ) {
    const caseData = await this.repo.findCaseById(caseId);
    if (!caseData)
      throw new AppError(
        CASE_MESSAGES.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );

    const { lawyer_id, client_id } = caseData.service;
    const isOwner =
      (user.role === "client" && String(client_id) === String(user.id)) ||
      (user.role === "lawyer" && String(lawyer_id) === String(user.id));
    if (!isOwner)
      throw new AppError(
        CASE_MESSAGES.ACCESS_DENIED,
        HttpStatusCodes.FORBIDDEN.code
      );

    const uploaded = await this.s3.upload(file, "private/cases");
    const created = await this.repo.addAttachment({
      caseId,
      category_id: dto.category_id,
      label: dto.label,
      description: dto.description,
      file_key: uploaded.key,
      uploaded_by: user.role,
    });
    if (!created)
      throw new AppError(
        CASE_MESSAGES.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );

    return { id: created.id, url: await this.s3.getUrl(uploaded.key) };
  }
}
