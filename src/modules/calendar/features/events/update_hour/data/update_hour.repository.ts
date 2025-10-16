//src/modules/calendar/features/events/update_hour/data/update_hour.repository.ts
import prisma from "../../../../../../config/prisma_client";

export function findEventByIdForLawyer(eventId: string, lawyerId: string) {
  return prisma.calendar_events.findFirst({
    where: { id: eventId, lawyer_id: lawyerId },
    select: { id: true },
  });
}

export function updateEventTime(eventId: string, startDate: Date, endDate: Date) {
  return prisma.calendar_events.update({
    where: { id: eventId },
    data: { start_date: startDate, end_date: endDate },
    select: { id: true },
  });
}
