import { z } from "zod";
import { work_day } from "@prisma/client";
import { MESSAGES } from "../../../../constants/messages";

export const CreateWorkScheduleSchema = z.object({
  day: z.nativeEnum(work_day),
  open_time: z.string().min(1, MESSAGES.CALENDAR.CALENDAR_ERROR_REQUIRED_TIME),
  close_time: z.string().min(1, MESSAGES.CALENDAR.CALENDAR_ERROR_REQUIRED_TIME)
});

export type CreateWorkScheduleDto = z.infer<typeof CreateWorkScheduleSchema>;
