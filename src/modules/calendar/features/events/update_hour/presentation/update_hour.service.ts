//src/modules/calendar/features/events/update_hour/presentation/update_hour.service.ts
import {
  UpdateCalendarEventTimeRequest,
  UpdateCalendarEventTimeResponse,
} from "../domain/update_hour.payload";
import { AppError } from "../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import {
  findEventByIdForLawyer,
  updateEventTime,
} from "../data/update_hour.repository";

type CurrentUser = { id: string; role: "lawyer" | "client" | "admin" };

export async function updateCalendarEventTimeService(
  id: string,
  dto: UpdateCalendarEventTimeRequest,
  user: CurrentUser
): Promise<UpdateCalendarEventTimeResponse> {
  if (user.role !== "lawyer") {
    throw new AppError(
      "Solo los abogados pueden modificar eventos.",
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

  const startDate = new Date(dto.start_date);
  const endDate = new Date(dto.end_date);

  const updated = await updateEventTime(id, startDate, endDate);

  return { id: updated.id, message: "Hora actualizada correctamente" };
}
