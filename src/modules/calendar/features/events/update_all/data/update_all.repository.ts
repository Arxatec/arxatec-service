// src/modules/calendar/features/events/update_all/data/update_all.repository.ts
import prisma from "../../../../../../config/prisma_client";

export function findEventOwnership(id: string) {
  return prisma.calendar_events.findUnique({
    where: { id },
    select: {
      id: true,
      lawyer_id: true,
      case: { select: { id: true, service_id: true } },
    },
  });
}

export function findCaseMinimalById(caseId: string) {
  return prisma.cases.findUnique({
    where: { id: caseId },
    select: {
      id: true,
      service: {
        select: {
          lawyer: { select: { user_id: true } },
          client: { select: { user_id: true } },
        },
      },
    },
  });
}

export function findClientUserById(clientUserId: string) {
  return prisma.users.findUnique({
    where: { id: clientUserId },
    select: { id: true },
  });
}

export function updateCalendarEventById(id: string, data: any) {
  return prisma.calendar_events.update({
    where: { id },
    data,
    select: { id: true },
  });
}
