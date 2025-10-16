// src/modules/calendar/features/events/create_event/data/create_event.repository.ts
import prisma from "../../../../../../config/prisma_client";
import { Prisma } from "@prisma/client";

export function createCalendarEvent(data: Prisma.calendar_eventsCreateInput) {
  return prisma.calendar_events.create({ data, select: { id: true } });
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
          external_client: { select: { id: true } },
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
