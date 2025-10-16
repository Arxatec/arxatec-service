// src/modules/calendar/features/events/create_event/domain/create_event.payload.ts
import z from "zod";
import { CreateCalendarEventSchema } from "./create_event.schema";

export type CreateCalendarEventRequest = z.infer<
  typeof CreateCalendarEventSchema
>;

export interface CreateCalendarEventResponse {
  id: string;
  message: string;
}
