// src/modules/calendar/features/events/index.ts
import { Router } from "express";

import { createCalendarEventRoutes } from "./create_event";
import { calendarEventDetailRoutes } from "./get_detail";
import { listCalendarEventsRoutes } from "./get_list";
import { updateCalendarEventAllRoutes } from "./update_all";
import { updateCalendarEventTimeRoutes } from "./update_hour";
import { deleteCalendarEventRoutes } from "./delete";

export const router = Router();

router.use("/create", createCalendarEventRoutes);
router.use("/detail", calendarEventDetailRoutes);
router.use("/list", listCalendarEventsRoutes);
router.use("/update", updateCalendarEventAllRoutes);
router.use("/time", updateCalendarEventTimeRoutes);
router.use("/delete", deleteCalendarEventRoutes);

export { router as calendarEventRouter };
