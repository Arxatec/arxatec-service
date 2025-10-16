// src/modules/calendar/features/events/get_detail/domain/get_detail.payload.ts
import z from "zod";
import { GetCalendarEventDetailSchema } from "./get_detail.schema";

export type GetCalendarEventDetailParams = z.infer<
  typeof GetCalendarEventDetailSchema
>;

export interface GetCalendarEventDetailResponse {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  reminderMinutes?: number;
  status: string;
  case?: { id: string; title: string };
  client?: { id: string; name?: string };
}
