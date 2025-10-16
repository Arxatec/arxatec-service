import { Router } from "express";
import { calendarEventRouter } from "./features/events";

export const router = Router();

router.use("/events", calendarEventRouter);

export { router as calendarRouter };
