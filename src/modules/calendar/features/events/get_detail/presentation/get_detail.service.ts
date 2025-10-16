// src/modules/calendar/features/events/get_detail/presentation/get_detail.service.ts
import { AppError } from "../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { GetCalendarEventDetailResponse } from "../domain/get_detail.payload";
import {
  findCalendarEventByIdForDetail,
  findCaseClientUserIdByServiceId,
} from "../data/get_detail.repository";

type CurrentUser = { id: string; role: "lawyer" | "client" | "admin" };

export async function getCalendarEventDetailService(
  id: string,
  user: CurrentUser
): Promise<GetCalendarEventDetailResponse> {
  const ev = await findCalendarEventByIdForDetail(id);
  if (!ev)
    throw new AppError("Evento no encontrado", HttpStatusCodes.NOT_FOUND.code);

  if (user.role === "lawyer") {
    if (ev.lawyer_id !== user.id)
      throw new AppError("No autorizado", HttpStatusCodes.FORBIDDEN.code);
  } else if (user.role === "client") {
    let visible = false;
    if (ev.client_id && ev.client_id === user.id) visible = true;
    if (!visible && ev.case?.service_id) {
      const svc = await findCaseClientUserIdByServiceId(ev.case.service_id);
      if (svc?.client?.user_id && svc.client.user_id === user.id)
        visible = true;
    }
    if (!visible)
      throw new AppError("No autorizado", HttpStatusCodes.FORBIDDEN.code);
  } else {
    throw new AppError("No autorizado", HttpStatusCodes.FORBIDDEN.code);
  }

  return {
    id: ev.id,
    title: ev.title,
    description: ev.description ?? undefined,
    startDate: ev.start_date.toISOString(),
    endDate: ev.end_date.toISOString(),
    location: ev.location ?? undefined,
    reminderMinutes: ev.reminder_minutes ?? undefined,
    status: ev.status,
    case: ev.case ? { id: ev.case.id, title: ev.case.title } : undefined,
    client: ev.client
      ? {
          id: ev.client.id,
          name:
            [ev.client.first_name, ev.client.last_name]
              .filter(Boolean)
              .join(" ") || undefined,
        }
      : undefined,
  };
}
