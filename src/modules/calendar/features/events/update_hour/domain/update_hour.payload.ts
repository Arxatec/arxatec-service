//src/modules/calendar/features/events/update_hour/domain/update_hour.payload.ts
import z from "zod";
import { UpdateCalendarEventTimeSchema } from "./update_hour.schema";

export type UpdateCalendarEventTimeRequest = z.infer<
  typeof UpdateCalendarEventTimeSchema
>;

export interface UpdateCalendarEventTimeResponse {
  id: string;
  message: string;
}
