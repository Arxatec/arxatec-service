import { z } from "zod";
import { work_day } from "@prisma/client";
import { MESSAGES } from "../../../../constants/messages";

export const UpdateWorkScheduleSchema = z.object({
  day: z.nativeEnum(work_day).optional(),
  open_time: z.string().min(1, MESSAGES.CALENDAR.CALENDAR_ERROR_REQUIRED_TIME).optional(),
  close_time: z.string().min(1, MESSAGES.CALENDAR.CALENDAR_ERROR_REQUIRED_TIME).optional()
}).refine(data => Object.keys(data).length > 0, {
  message: MESSAGES.CALENDAR.CALENDAR_ERROR_NO_UPDATE_FIELDS
})

export type UpdateWorkScheduleDto = z.infer<typeof UpdateWorkScheduleSchema>;
