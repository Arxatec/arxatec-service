// src/modules/cases/features/manage/update_case/presentation/update_case.service.ts
import { UpdateCaseDTO } from "../domain/update_case.schema";
import { UpdateCaseRepository } from "../data/update_case.repository";
import { AppError } from "../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { MESSAGES } from "../../../../../../constants/messages";
import { CatalogRepository } from "../../../shared/catalog/catalog.repository";
import { CapacityPolicyService } from "../../../shared/capacity_policy/capacity_policy.service";
import prisma from "../../../../../../config/prisma_client";

type CurrentUser = { id: string; role: "client" | "lawyer" };

export class UpdateCaseService {
  constructor(
    private readonly repo = new UpdateCaseRepository(),
    private readonly catalog = new CatalogRepository(),
    private readonly policy = new CapacityPolicyService()
  ) {}

  async execute(id: string, dto: UpdateCaseDTO, user: CurrentUser) {
    const found = await this.repo.getById(id);
    if (!found) {
      throw new AppError(MESSAGES.CASE.NOT_FOUND, HttpStatusCodes.NOT_FOUND.code);
    }
    if (found.archived) {
      throw new AppError(MESSAGES.CASE.CANNOT_EDIT_ARCHIVED, HttpStatusCodes.CONFLICT.code);
    }

    const closedStatusId = await this.catalog.getClosedStatusId();
    const { takenStatusId } = await this.catalog.getOpenAndTakenStatusIds();

    if (found.status_id === closedStatusId) {
      throw new AppError(MESSAGES.CASE.CANNOT_EDIT_CLOSED, HttpStatusCodes.CONFLICT.code);
    }

    const isOwner =
      (user.role === "client" && found.service?.client_id === user.id) ||
      (user.role === "lawyer" && found.service?.lawyer_id === user.id);
    if (!isOwner) {
      throw new AppError(MESSAGES.CASE.ACCESS_DENIED, HttpStatusCodes.FORBIDDEN.code);
    }

    if (user.role === "client" && dto.external_client_id) {
      throw new AppError(
        MESSAGES.CASE.EXTERNAL_CLIENT_NOT_ALLOWED_FOR_CLIENT,
        HttpStatusCodes.FORBIDDEN.code
      );
    }
    if (user.role === "lawyer" && dto.selected_lawyer_id) {
      throw new AppError(
        MESSAGES.CASE.LAWYER_CANNOT_CHANGE_ASSIGNED_LAWYER,
        HttpStatusCodes.FORBIDDEN.code
      );
    }

    if (dto.category_id) {
      const categories = await this.repo.getAllCategories();
      if (!categories.some((c) => c.id === dto.category_id)) {
        throw new AppError(MESSAGES.CASE.INVALID_ID, HttpStatusCodes.BAD_REQUEST.code);
      }
    }

    const willMakePrivateAndTaken =
      user.role === "client" &&
      dto.selected_lawyer_id !== undefined &&
      found.is_public === true &&
      !found.service?.lawyer_id;

    if (willMakePrivateAndTaken && dto.selected_lawyer_id) {
      await this.policy.assertLawyerCanTake(dto.selected_lawyer_id);
    }

    let newExternalClientId: string | undefined;
    if (user.role === "lawyer" && dto.external_client_id) {
      const ok = await this.repo.findExternalClientByIdForLawyer(
        dto.external_client_id,
        user.id
      );
      if (!ok) {
        throw new AppError(
          MESSAGES.CASE.EXTERNAL_CLIENT_NOT_FOUND,
          HttpStatusCodes.FORBIDDEN.code
        );
      }
      newExternalClientId = dto.external_client_id;
    }

    const updatesCase: any = {
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.urgency !== undefined && { urgency: dto.urgency }),
      ...(dto.reference_code !== undefined && { reference_code: dto.reference_code }),
      ...(dto.category_id !== undefined && { category: { connect: { id: dto.category_id } } }),
    };

    // 🧾 Todo atómico
    const updated = await prisma.$transaction(async (tx) => {
      if (willMakePrivateAndTaken && dto.selected_lawyer_id) {
        await tx.services.update({
          where: { id: found.service.id },
          data: { lawyer: { connect: { user_id: dto.selected_lawyer_id } } },
        });
        updatesCase.is_public = false;
        updatesCase.status = { connect: { id: takenStatusId } };
      }

      if (newExternalClientId) {
        await tx.services.update({
          where: { id: found.service.id },
          data: { external_client: { connect: { id: newExternalClientId } } },
        });
      }

      return tx.cases.update({
        where: { id: found.id },
        data: updatesCase,
      });
    });

    return {
      id: updated.id,
      service_id: found.service.id,
      title: updated.title,
      description: updated.description,
      category_id: updated.category_id,
      status_id: updated.status_id,
      urgency: updated.urgency,
      is_public: updated.is_public,
      reference_code: updated.reference_code ?? null,
    };
  }
}
