// src/modules/cases/features/associations/attachments/create/presentation/create.service.ts
import { AppError } from "../../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../../constants/http_status_codes";
import { CASE_MESSAGES } from "../../../../../../../constants/messages/case";
import type { CreateAttachmentRequest } from "../domain/create.payload";
import { findCaseById, addAttachment } from "../data/create.repository";
import { uploadS3File, getS3FileUrl } from "../../../../shared/s3_file/s3_file.service";

type CurrentUser = { id: string | number; role: "client" | "lawyer" };

export async function createCaseAttachment(
  caseId: string,
  dto: Omit<CreateAttachmentRequest, "file_key">,
  file: Express.Multer.File,
  user: CurrentUser
) {
  const caseData = await findCaseById(caseId);
  if (!caseData) {
    throw new AppError(CASE_MESSAGES.NOT_FOUND, HttpStatusCodes.NOT_FOUND.code);
  }

  const { lawyer_id, client_id } = caseData.service;
  const isOwner =
    (user.role === "client" && String(client_id) === String(user.id)) ||
    (user.role === "lawyer" && String(lawyer_id) === String(user.id));

  if (!isOwner) {
    throw new AppError(CASE_MESSAGES.ACCESS_DENIED, HttpStatusCodes.FORBIDDEN.code);
  }

  const uploaded = await uploadS3File(file, "private/cases");

  const created = await addAttachment({
    caseId,
    category_id: dto.category_id,
    label: dto.label,
    description: dto.description,
    file_key: uploaded.key,
    uploaded_by: user.role,
  });

  if (!created) {
    throw new AppError(CASE_MESSAGES.NOT_FOUND, HttpStatusCodes.NOT_FOUND.code);
  }

  const url = await getS3FileUrl(uploaded.key);

  return {
    attachment: { id: created.id, url },
    user: { id: user.id, role: user.role },
  };
}
