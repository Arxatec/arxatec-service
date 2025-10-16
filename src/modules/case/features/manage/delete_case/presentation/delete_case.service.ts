// src/modules/cases/features/manage/delete_case/presentation/delete_case.service.ts
import type {
  DeleteCaseParams,
  DeleteCaseResponse,
} from "../domain/delete_case.payload";
import { AppError } from "../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import {
  findCaseForDeletion,
  listAttachmentKeysByCase,
  deleteCaseRecord,
} from "../data/delete_case.repository";

import { deleteFile } from "../../../../../../infrastructure/aws/";


type CurrentUser = { id: string; role: "client" | "lawyer" | "admin" };

export async function deleteCaseService(
  params: DeleteCaseParams,
  user: CurrentUser
): Promise<DeleteCaseResponse> {
  const target = await findCaseForDeletion(params.case_id);
  if (!target) {
    throw new AppError(
      "El caso no existe o ya fue eliminado.",
      HttpStatusCodes.NOT_FOUND.code
    );
  }

  const ownerUserId = target.service.client?.user_id ?? null;
  if (
    user.role !== "client" ||
    !ownerUserId ||
    String(ownerUserId) !== String(user.id)
  ) {
    throw new AppError(
      "No tienes permisos para eliminar este caso.",
      HttpStatusCodes.FORBIDDEN.code
    );
  }

  const hasLawyer = Boolean(target.service.lawyer?.user_id);
  const isOpen = target.status === "open";
  if (!isOpen || hasLawyer) {
    throw new AppError(
      "Solo puedes eliminar casos que no hayan sido tomados por un abogado (estado 'open' y sin asignación).",
      HttpStatusCodes.FORBIDDEN.code
    );
  }

  const keys = await listAttachmentKeysByCase(params.case_id);
  if (keys.length > 0) {
    await Promise.all(keys.map((k) => deleteFile(k)));
  }

  const deleted = await deleteCaseRecord(params.case_id);

  return {
    message: "Caso eliminado correctamente.",
    deleted_case_id: deleted.id,
  };
}
