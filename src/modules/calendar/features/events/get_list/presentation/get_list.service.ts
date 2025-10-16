//src/modules/calendar/features/events/get_list/presentation/get_list.service.ts
import {
  GetCalendarEventsRequest,
  GetCalendarEventsResponse,
} from "../domain/get_list.payload";
import { AppError } from "../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import {
  findEventsForClient,
  findEventsForLawyer,
} from "../data/get_list.repository";

type CurrentUser = { id: string; role: "lawyer" | "client" | "admin" };

export async function listCalendarEventsService(
  query: GetCalendarEventsRequest,
  user: CurrentUser
): Promise<GetCalendarEventsResponse> {
  const start = query.start ? new Date(query.start) : undefined;
  const end = query.end ? new Date(query.end) : undefined;

  if (user.role === "lawyer") {
    const rows = await findEventsForLawyer({
      lawyerId: user.id,
      caseId: query.case_id,
      clientId: query.client_id,
      start,
      end,
    });
    return rows.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      start_date: e.start_date.toISOString(),
      end_date: e.end_date.toISOString(),
      location: e.location,
      reminder_minutes: e.reminder_minutes ?? undefined,
      status: e.status,
      case: e.case ? { id: e.case.id, title: e.case.title } : null,
      client: e.client
        ? {
            id: e.client.id,
            name: `${e.client.first_name} ${e.client.last_name}`.trim(),
          }
        : null,
    }));
  }

  if (user.role === "client") {
    const rows = await findEventsForClient({
      clientId: user.id,
      caseId: query.case_id,
      start,
      end,
    });
    return rows.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      start_date: e.start_date.toISOString(),
      end_date: e.end_date.toISOString(),
      location: e.location,
      reminder_minutes: e.reminder_minutes ?? undefined,
      status: e.status,
      case: e.case ? { id: e.case.id, title: e.case.title } : null,
      lawyer: e.lawyer
        ? {
            id: e.lawyer.id,
            name: `${e.lawyer.first_name} ${e.lawyer.last_name}`.trim(),
          }
        : null,
    }));
  }

  throw new AppError("No autorizado", HttpStatusCodes.FORBIDDEN.code);
}
