//src/modules/calendar/features/events/delete/data/delete_event.repository.ts
import prisma from "../../../../../../config/prisma_client";

export function findEventByIdForLawyer(eventId: string, lawyerId: string) {
  return prisma.calendar_events.findFirst({
    where: { id: eventId, lawyer_id: lawyerId },
    select: { id: true },
  });
}

export function deleteEventById(eventId: string) {
  return prisma.calendar_events.delete({
    where: { id: eventId },
    select: { id: true },
  });
}
