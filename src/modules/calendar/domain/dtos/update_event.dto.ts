import { z } from "zod";
import { MESSAGES } from "../../../../constants/messages";

export const UpdateEventSchema = z.object({
  title: z.string().min(1, MESSAGES.CALENDAR.CALENDAR_ERROR_REQUIRED_TITLE).optional(),
  description: z.string().optional(),
  dates: z.array(z.string().min(1, MESSAGES.CALENDAR.CALENDAR_ERROR_REQUIRED_DATE)).optional(),
  start_time: z.string().min(1, MESSAGES.CALENDAR.CALENDAR_ERROR_REQUIRED_TIME).optional(),
  end_time: z.string().min(1, MESSAGES.CALENDAR.CALENDAR_ERROR_REQUIRED_TIME).optional()
}).refine(data => Object.keys(data).length > 0, {
  message: MESSAGES.CALENDAR.CALENDAR_ERROR_NO_UPDATE_FIELDS
})

export type UpdateEventDto = z.infer<typeof UpdateEventSchema>;
