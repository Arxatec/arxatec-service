// src/modules/cases/features/manage/case_detail/presentation/case_detail.service.ts
import { AppError } from "../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { CASE_MESSAGES } from "../../../../../../constants/messages/case";
import { getCaseById } from "../data/case_detail.repository";

type CurrentUser = { id: string; role: "client" | "lawyer" };

export async function getCaseDetailService(id: string, user: CurrentUser) {
  const found = await getCaseById(id);
  if (!found)
    throw new AppError(CASE_MESSAGES.NOT_FOUND, HttpStatusCodes.NOT_FOUND.code);

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
    category: found.category,
    status: found.status,
    urgency: found.urgency,
    is_public: found.is_public,
    created_at: found.created_at,
    client_id: found.service?.client_id || null,
    external_client_id: found.service?.external_client_id || null,
    lawyer_id: found.service?.lawyer_id || null,
  };
}
