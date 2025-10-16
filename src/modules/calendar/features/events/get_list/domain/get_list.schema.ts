//src/modules/calendar/features/events/get_list/domain/get_list.schema.ts
import { z } from "zod";

export const GetCalendarEventsQuerySchema = z.object({
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
  case_id: z.string().uuid().optional(),
  client_id: z.string().uuid().optional(),
});
