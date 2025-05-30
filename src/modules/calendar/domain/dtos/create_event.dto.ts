import { z } from "zod";
import { MESSAGES } from "../../../../constants/messages";

export const CreateEventSchema = z.object({
  title: z.string().min(1, MESSAGES.CALENDAR.CALENDAR_ERROR_REQUIRED_TITLE),
  description: z.string().optional(),
  dates: z.array(z.string()).min(1, MESSAGES.CALENDAR.CALENDAR_ERROR_REQUIRED_DATE),
  start_time: z.string().min(1, MESSAGES.CALENDAR.CALENDAR_ERROR_REQUIRED_TIME),
  end_time: z.string().min(1, MESSAGES.CALENDAR.CALENDAR_ERROR_REQUIRED_TIME)
});

export type CreateEventDto = z.infer<typeof CreateEventSchema>;
