// src/modules/calendar/features/events/get_detail/data/get_detail.repository.ts
import prisma from "../../../../../../config/prisma_client";

export function findCalendarEventByIdForDetail(id: string) {
  return prisma.calendar_events.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      start_date: true,
      end_date: true,
      location: true,
      reminder_minutes: true,
      status: true,
      case_id: true,
      client_id: true,
      lawyer_id: true,
      case: { select: { id: true, title: true, service_id: true } },
      client: { select: { id: true, first_name: true, last_name: true } },
    },
  });
}

export function findCaseClientUserIdByServiceId(serviceId: string) {
  return prisma.services.findUnique({
    where: { id: serviceId },
    select: { client: { select: { user_id: true } } },
  });
}
