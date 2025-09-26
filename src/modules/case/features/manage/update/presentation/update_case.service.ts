// src/modules/cases/features/manage/update_case/presentation/update_case.service.ts
import { UpdateCaseDTO } from "../domain/update_case.schema";
import { UpdateCaseRepository } from "../data/update_case.repository";
import { AppError } from "../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { CASE_MESSAGES } from "../../../../../../constants/messages/case";

type CurrentUser = { id: string; role: "client" | "lawyer" };

export class UpdateCaseService {
  constructor(private readonly repo = new UpdateCaseRepository()) {}

  async execute(id: string, dto: UpdateCaseDTO, user: CurrentUser) {
    const found = await this.repo.getById(id);
    if (!found) {
      throw new AppError(
        CASE_MESSAGES.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );
    }

    if (found.archived) {
      throw new AppError(
        CASE_MESSAGES.CANNOT_EDIT_ARCHIVED,
        HttpStatusCodes.CONFLICT.code
      );
    }

    const statuses = await this.repo.getAllStatuses();
    const closedStatusId = statuses[statuses.length - 1].id;
    if (found.status_id === closedStatusId) {
      throw new AppError(
        CASE_MESSAGES.CANNOT_EDIT_CLOSED,
        HttpStatusCodes.CONFLICT.code
      );
    }

    const isOwner =
      (user.role === "client" && found.service?.client_id === user.id) ||
      (user.role === "lawyer" && found.service?.lawyer_id === user.id);
    if (!isOwner) {
      throw new AppError(
        CASE_MESSAGES.ACCESS_DENIED,
        HttpStatusCodes.FORBIDDEN.code
      );
    }

    if (dto.category_id) {
      const categories = await this.repo.getAllCategories();
      const valid = categories.some((c) => c.id === dto.category_id);
      if (!valid) {
        throw new AppError(
          CASE_MESSAGES.INVALID_ID,
          HttpStatusCodes.BAD_REQUEST.code
        );
      }
    }

    const updated = await this.repo.update(id, {
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.category_id !== undefined && { category_id: dto.category_id }),
      ...(dto.urgency !== undefined && { urgency: dto.urgency }),
      ...(dto.is_public !== undefined&& { is_public: dto.is_public }),
      ...(dto.reference_code !== undefined && {
        reference_code: dto.reference_code,
      }),
    });

    return {
      id: updated.id,
      title: updated.title,
      category_id: updated.category_id,
      urgency: updated.urgency,
      is_public: updated.is_public,
      reference_code: updated.reference_code ?? null,
    };
  }
}
