//src/modules/calendar/features/events/get_list/data/get_list.repository.ts
import prisma from "../../../../../../config/prisma_client";

type Filters = {
  lawyerId?: string;
  clientId?: string;
  caseId?: string;
  start?: Date;
  end?: Date;
};

export function findEventsForLawyer(filters: Filters) {
  const { lawyerId, caseId, clientId, start, end } = filters;
  return prisma.calendar_events.findMany({
    where: {
      lawyer_id: lawyerId,
      ...(caseId ? { case_id: caseId } : {}),
      ...(clientId ? { client_id: clientId } : {}),
      ...(start || end
        ? {
            AND: [
              start ? { start_date: { gte: start } } : {},
              end ? { start_date: { lte: end } } : {},
            ],
          }
        : {}),
    },
    orderBy: { start_date: "asc" },
    select: {
      id: true,
      title: true,
      description: true,
      start_date: true,
      end_date: true,
      location: true,
      reminder_minutes: true,
      status: true,
      case: { select: { id: true, title: true } },
      client: { select: { id: true, first_name: true, last_name: true } },
    },
  });
}

export function findEventsForClient(filters: Filters) {
  const { clientId, caseId, start, end } = filters;
  return prisma.calendar_events.findMany({
    where: {
      client_id: clientId,
      NOT: { case_id: null },
      ...(caseId ? { case_id: caseId } : {}),
      ...(start || end
        ? {
            AND: [
              start ? { start_date: { gte: start } } : {},
              end ? { start_date: { lte: end } } : {},
            ],
          }
        : {}),
    },
    orderBy: { start_date: "asc" },
    select: {
      id: true,
      title: true,
      description: true,
      start_date: true,
      end_date: true,
      location: true,
      reminder_minutes: true,
      status: true,
      case: { select: { id: true, title: true } },
      lawyer: { select: { id: true, first_name: true, last_name: true } },
    },
  });
}
