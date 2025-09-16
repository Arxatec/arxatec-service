// src/modules/cases/features/associations/attachments/list/presentation/list.service.ts
import { ListAttachmentRepository } from "../data/list.repository";
import { AppError } from "../../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../../constants/http_status_codes";
import { CASE_MESSAGES } from "../../../../../../../constants/messages/case";
import { S3FileService } from "../../../../shared/s3_file/s3_file.service";
import { Pagination } from "../../../../../../../utils/pagination";

type CurrentUser = { id: string | number; role: "client" | "lawyer" };

export class ListAttachmentService {
  constructor(
    private readonly repo = new ListAttachmentRepository(),
    private readonly s3 = new S3FileService()
  ) {}

  async list(caseId: string, user: CurrentUser, query: any) {
    const caseData = await this.repo.findCaseById(caseId);
    if (!caseData)
      throw new AppError(
        CASE_MESSAGES.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );

    const { lawyer_id, client_id, id: service_id } = caseData.service;
    const isOwner =
      (user.role === "client" && String(client_id) === String(user.id)) ||
      (user.role === "lawyer" && String(lawyer_id) === String(user.id));
    if (!isOwner)
      throw new AppError(
        CASE_MESSAGES.ACCESS_DENIED,
        HttpStatusCodes.FORBIDDEN.code
      );

    const { page, limit, skip } = Pagination.getPaginationParams(query);
    const [total, rows] = await Promise.all([
      this.repo.countByServiceId(service_id),
      this.repo.findByServiceId(service_id, skip, limit),
    ]);

    const items = await Promise.all(
      rows.map(async (att) => ({
        id: att.id,
        label: att.label,
        description: att.description ?? null,
        category_id: att.category_id,
        uploaded_by: att.uploaded_by,
        created_at: att.created_at,
        url: await this.s3.getUrl(att.file_key),
      }))
    );

    const meta = Pagination.buildPaginationMeta(total, page, limit);
    return { items, meta };
  }
}
