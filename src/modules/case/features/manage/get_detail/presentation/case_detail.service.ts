// src/modules/cases/features/manage/case_detail/presentation/case_detail.service.ts
import { CaseDetailRepository } from "../data/case_detail.repository";
import { AppError } from "../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { CASE_MESSAGES } from "../../../../../../constants/messages/case";

type CurrentUser = { id: string; role: "client" | "lawyer" };

export class CaseDetailService {
  constructor(private readonly repo = new CaseDetailRepository()) {}

  async execute(id: string, user: CurrentUser) {
    const found = await this.repo.getById(id);
    if (!found)
      throw new AppError(
        CASE_MESSAGES.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );

    const isOwner =
      (user.role === "client" && found.service?.client_id === user.id) ||
      (user.role === "lawyer" && found.service?.lawyer_id === user.id);

    if (!isOwner)
      throw new AppError(
        CASE_MESSAGES.ACCESS_DENIED,
        HttpStatusCodes.FORBIDDEN.code
      );

    return {
      id: found.id,
      title: found.title,
      description: found.description,
      category: { id: found.category.id, name: found.category.name },
      status: { id: found.status.id, name: found.status.name },
      urgency: found.urgency,
      is_public: found.is_public,
      created_at: found.created_at,
      service: {
        id: found.service.id,
        lawyer_id: found.service.lawyer_id,
        client_id: found.service.client_id,
        external_client_id: found.service.external_client_id,
      },
      attachments: found.service.attachments.map((a) => ({
        id: a.id,
        label: a.label,
        category_id: a.category_id,
        uploaded_by: a.uploaded_by,
        created_at: a.created_at,
      })),
      histories: found.histories.map((h) => ({
        id: h.id,
        field: h.field,
        old_value: h.old_value,
        new_value: h.new_value,
        created_at: h.created_at,
      })),
    };
  }
}
