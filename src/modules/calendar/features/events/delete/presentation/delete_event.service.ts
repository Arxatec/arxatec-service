//src/modules/calendar/features/events/delete/presentation/delete_event.service.ts
import { DeleteCalendarEventResponse } from "../domain/delete_event.payload";
import { AppError } from "../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import {
  findEventByIdForLawyer,
  deleteEventById,
} from "../data/delete_event.repository";

type CurrentUser = { id: string; role: "lawyer" | "client" | "admin" };

export async function deleteCalendarEventService(
  id: string,
  user: CurrentUser
): Promise<DeleteCalendarEventResponse> {
  if (user.role !== "lawyer") {
    throw new AppError(
      "Solo los abogados pueden eliminar eventos.",
      HttpStatusCodes.FORBIDDEN.code
    );
  }

  const existing = await findEventByIdForLawyer(id, user.id);
  if (!existing) {
    throw new AppError(
      "Evento no encontrado o sin permisos.",
      HttpStatusCodes.NOT_FOUND.code
    );
  }

  const deleted = await deleteEventById(id);

  return { id: deleted.id, message: "Evento eliminado correctamente" };
}
