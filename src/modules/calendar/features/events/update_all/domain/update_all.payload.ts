// src/modules/calendar/features/events/update_all/domain/update_all.payload.ts
import z from "zod";
import {
  UpdateCalendarEventParamsSchema,
  UpdateCalendarEventBodySchema,
} from "./update_all.schema";

export type UpdateCalendarEventParams = z.infer<
  typeof UpdateCalendarEventParamsSchema
>;
export type UpdateCalendarEventBody = z.infer<
  typeof UpdateCalendarEventBodySchema
>;

export interface UpdateCalendarEventResponse {
  message: string;
  id: string;
}
