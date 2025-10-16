//src/modules/calendar/features/events/get_list/domain/get_list.payload.ts
import z from "zod";
import { GetCalendarEventsQuerySchema } from "./get_list.schema";

export type GetCalendarEventsRequest = z.infer<
  typeof GetCalendarEventsQuerySchema
>;

export interface CalendarEventListItem {
  id: string;
  title: string;
  description?: string | null;
  start_date: string;
  end_date: string;
  location?: string | null;
  reminder_minutes?: number | null;
  status: string;
  case?: { id: string; title: string } | null;
  client?: { id: string; name: string } | null;
  lawyer?: { id: string; name: string } | null;
}

export type GetCalendarEventsResponse = CalendarEventListItem[];
