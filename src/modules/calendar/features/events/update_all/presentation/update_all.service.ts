// src/modules/calendar/features/events/update_all/presentation/update_all.service.ts
import { AppError } from "../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import {
  UpdateCalendarEventBody,
  UpdateCalendarEventResponse,
} from "../domain/update_all.payload";
import {
  findCaseMinimalById,
  findClientUserById,
  findEventOwnership,
  updateCalendarEventById,
} from "../data/update_all.repository";

type CurrentUser = { id: string; role: "lawyer" | "client" | "admin" };

export async function updateCalendarEventAllService(
  id: string,
  dto: UpdateCalendarEventBody,
  user: CurrentUser
): Promise<UpdateCalendarEventResponse> {
  if (user.role !== "lawyer") {
    throw new AppError(
      "Solo los abogados pueden actualizar eventos.",
      HttpStatusCodes.FORBIDDEN.code
    );
  }

  const ownership = await findEventOwnership(id);
  if (!ownership)
    throw new AppError("Evento no encontrado", HttpStatusCodes.NOT_FOUND.code);
  if (ownership.lawyer_id !== user.id)
    throw new AppError("No autorizado", HttpStatusCodes.FORBIDDEN.code);

  let nextCaseId: string | null | undefined = dto.case_id;
  let nextClientId: string | null | undefined = dto.client_id;

  if (typeof nextCaseId !== "undefined") {
    if (nextCaseId) {
      const c = await findCaseMinimalById(nextCaseId);
      if (!c)
        throw new AppError(
          "El caso no existe.",
          HttpStatusCodes.BAD_REQUEST.code
        );
      const caseLawyer = c.service?.lawyer?.user_id ?? null;
      if (!caseLawyer || caseLawyer !== user.id) {
        throw new AppError(
          "No tienes permisos sobre el caso indicado.",
          HttpStatusCodes.FORBIDDEN.code
        );
      }
      const caseClient = c.service?.client?.user_id ?? null;
      if (
        typeof nextClientId !== "undefined" &&
        nextClientId &&
        caseClient &&
        nextClientId !== caseClient
      ) {
        throw new AppError(
          "El cliente indicado no coincide con el cliente del caso.",
          HttpStatusCodes.BAD_REQUEST.code
        );
      }
      if (typeof nextClientId === "undefined" && caseClient)
        nextClientId = caseClient;
    } else {
      if (typeof nextClientId !== "undefined" && nextClientId) {
        const exists = await findClientUserById(nextClientId);
        if (!exists)
          throw new AppError(
            "El cliente indicado no existe.",
            HttpStatusCodes.BAD_REQUEST.code
          );
      }
    }
  } else if (
    typeof nextClientId !== "undefined" &&
    nextClientId &&
    ownership.case?.id
  ) {
    const c = await findCaseMinimalById(ownership.case.id);
    const caseClient = c?.service?.client?.user_id ?? null;
    if (caseClient && nextClientId !== caseClient) {
      throw new AppError(
        "El cliente indicado no coincide con el cliente del caso.",
        HttpStatusCodes.BAD_REQUEST.code
      );
    }
  }

  const data: any = {};
  if (typeof dto.title !== "undefined") data.title = dto.title.trim();
  if (typeof dto.description !== "undefined")
    data.description = dto.description?.trim() ?? null;
  if (typeof dto.location !== "undefined")
    data.location = dto.location?.trim() ?? null;
  if (typeof dto.reminder_minutes !== "undefined")
    data.reminder_minutes = dto.reminder_minutes ?? null;
  if (typeof dto.status !== "undefined") data.status = dto.status;

  if (dto.start_date) data.start_date = new Date(dto.start_date);
  if (dto.end_date) data.end_date = new Date(dto.end_date);
  if (
    dto.start_date &&
    dto.end_date &&
    new Date(dto.start_date) >= new Date(dto.end_date)
  ) {
    throw new AppError(
      "Rango de fechas inválido.",
      HttpStatusCodes.BAD_REQUEST.code
    );
  }

  if (typeof nextCaseId !== "undefined") {
    if (nextCaseId) data.case = { connect: { id: nextCaseId } };
    else data.case = { disconnect: true };
  }
  if (typeof nextClientId !== "undefined") {
    if (nextClientId) data.client = { connect: { id: nextClientId } };
    else data.client = { disconnect: true };
  }

  const updated = await updateCalendarEventById(id, data);

  return { id: updated.id, message: "Evento actualizado correctamente" };
}
