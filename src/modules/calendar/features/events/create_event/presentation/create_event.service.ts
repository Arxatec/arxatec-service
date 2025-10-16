// src/modules/calendar/features/events/create_event/presentation/create_event.service.ts
import {
  CreateCalendarEventRequest,
  CreateCalendarEventResponse,
} from "../domain/create_event.payload";
import { AppError } from "../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import {
  createCalendarEvent,
  findCaseMinimalById,
  findClientUserById,
} from "../data/create_event.repository";

type CurrentUser = { id: string; role: "lawyer" | "client" | "admin" };

export async function createCalendarEventService(
  dto: CreateCalendarEventRequest,
  user: CurrentUser
): Promise<CreateCalendarEventResponse> {
  if (user.role !== "lawyer") {
    throw new AppError(
      "Solo los abogados pueden crear eventos de calendario.",
      HttpStatusCodes.FORBIDDEN.code
    );
  }

  let resolvedClientUserId: string | undefined = dto.client_id;

  if (dto.case_id) {
    const caseMinimal = await findCaseMinimalById(dto.case_id);
    if (!caseMinimal) {
      throw new AppError(
        "El caso no existe.",
        HttpStatusCodes.BAD_REQUEST.code
      );
    }

    const caseLawyerUserId = caseMinimal.service?.lawyer?.user_id ?? null;
    if (!caseLawyerUserId || caseLawyerUserId !== user.id) {
      throw new AppError(
        "No tienes permisos para crear eventos en este caso.",
        HttpStatusCodes.FORBIDDEN.code
      );
    }

    const caseClientUserId = caseMinimal.service?.client?.user_id ?? null;

    if (
      dto.client_id &&
      caseClientUserId &&
      dto.client_id !== caseClientUserId
    ) {
      throw new AppError(
        "El cliente indicado no coincide con el cliente del caso.",
        HttpStatusCodes.BAD_REQUEST.code
      );
    }

    if (!dto.client_id && caseClientUserId) {
      resolvedClientUserId = caseClientUserId;
    }
  } else {
    if (dto.client_id) {
      const exists = await findClientUserById(dto.client_id);
      if (!exists) {
        throw new AppError(
          "El cliente indicado no existe.",
          HttpStatusCodes.BAD_REQUEST.code
        );
      }
    }
  }

  const data = {
    title: dto.title.trim(),
    description: dto.description?.trim(),
    start_date: new Date(dto.start_date),
    end_date: new Date(dto.end_date),
    location: dto.location?.trim(),
    reminder_minutes: dto.reminder_minutes,
    status: dto.status ?? undefined,
    lawyer: { connect: { id: user.id } },
    ...(dto.case_id ? { case: { connect: { id: dto.case_id } } } : {}),
    ...(resolvedClientUserId
      ? { client: { connect: { id: resolvedClientUserId } } }
      : {}),
  } as const;

  const created = await createCalendarEvent(data as any);

  return {
    id: created.id,
    message: "Evento creado correctamente",
  };
}
