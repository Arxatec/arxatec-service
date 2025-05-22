import { Request as ExpressRequest, Response } from "express";
import { CalendarService } from "../services/calendar.service";
import { CreateEventSchema } from "../../domain/dtos/create_event.dto";
import { UpdateEventSchema } from "../../domain/dtos/update_event.dto";
import { CreateWorkScheduleSchema } from "../../domain/dtos/create_work_schedule.dto";
import { UpdateWorkScheduleSchema } from "../../domain/dtos/update_work_schedule.dto";
import { ZodError } from "zod";
import { HttpStatusCodes } from "../../../../constants/http_status_codes";
import { buildHttpResponse } from "../../../../utils/build_http_response";
import { PrismaClient } from "@prisma/client";
import { MESSAGES } from "../../../../constants/messages";

const prisma = new PrismaClient();
const service = new CalendarService();

interface AuthRequest extends ExpressRequest {
  user?: {
    id: number;
    email: string;
  };
}

function internal(res: Response, path: string) {
  return res
    .status(HttpStatusCodes.INTERNAL_SERVER_ERROR.code)
    .json(
      buildHttpResponse(
        HttpStatusCodes.INTERNAL_SERVER_ERROR.code,
        MESSAGES.CALENDAR.CALENDAR_ERROR_FETCHING,
        path
      )
    );
}

async function verifyLawyer(userId: number): Promise<boolean> {
  const user = await prisma.users.findUnique({ where: { id: userId } });
  return user?.user_type === "lawyer";
}

export class CalendarController {
  async createEvent(req: AuthRequest, res: Response) {
    try {
      const dto = CreateEventSchema.parse(req.body);
      const userId = req.user?.id;
      if (!userId || !(await verifyLawyer(userId))) {
        return res.status(HttpStatusCodes.UNAUTHORIZED.code).json(
          buildHttpResponse(HttpStatusCodes.UNAUTHORIZED.code, MESSAGES.CALENDAR.CALENDAR_ERROR_ACCESS_DENIED, req.path)
        );
      }
      const created = await service.createEvent(userId, dto);
      return res.status(HttpStatusCodes.CREATED.code).json(
        buildHttpResponse(HttpStatusCodes.CREATED.code, MESSAGES.CALENDAR.CALENDAR_SUCCESS_CREATED, req.path, created)
      );
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(HttpStatusCodes.BAD_REQUEST.code).json(
          buildHttpResponse(HttpStatusCodes.BAD_REQUEST.code, MESSAGES.CALENDAR.CALENDAR_ERROR_CREATING, req.path, e)
        );
      }
      return internal(res, req.path);
    }
  }

  async getEventById(req: ExpressRequest, res: Response) {
    try {
      const event = await service.getEvent(Number(req.params.event_id));
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(HttpStatusCodes.OK.code, MESSAGES.CALENDAR.CALENDAR_SUCCESS_RETRIEVED, req.path, event)
      );
    } catch {
      return internal(res, req.path);
    }
  }

  async listEventsByLawyer(req: ExpressRequest, res: Response) {
    try {
      const events = await service.listEventsByLawyer(Number(req.params.lawyer_id));
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(HttpStatusCodes.OK.code, MESSAGES.CALENDAR.CALENDAR_SUCCESS_LIST_RETRIEVED, req.path, events)
      );
    } catch {
      return internal(res, req.path);
    }
  }

  async updateEvent(req: AuthRequest, res: Response) {
    try {
      const dto = UpdateEventSchema.parse(req.body);
      const userId = req.user?.id;
      if (!userId) {
        return res.status(HttpStatusCodes.UNAUTHORIZED.code).json(
          buildHttpResponse(HttpStatusCodes.UNAUTHORIZED.code, MESSAGES.CALENDAR.CALENDAR_ERROR_ACCESS_DENIED, req.path)
        );
      }
      const updated = await service.updateEvent(Number(req.params.event_id), dto, userId);
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(HttpStatusCodes.OK.code, MESSAGES.CALENDAR.CALENDAR_SUCCESS_UPDATED, req.path, updated)
      );
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(HttpStatusCodes.BAD_REQUEST.code).json(
          buildHttpResponse(HttpStatusCodes.BAD_REQUEST.code, MESSAGES.CALENDAR.CALENDAR_ERROR_UPDATING, req.path, e)
        );
      }
      return internal(res, req.path);
    }
  }

  async deleteEvent(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(HttpStatusCodes.UNAUTHORIZED.code).json(
          buildHttpResponse(HttpStatusCodes.UNAUTHORIZED.code, MESSAGES.CALENDAR.CALENDAR_ERROR_ACCESS_DENIED, req.path)
        );
      }
      await service.deleteEvent(Number(req.params.event_id), userId);
      return res.status(HttpStatusCodes.NO_CONTENT.code).send();
    } catch {
      return internal(res, req.path);
    }
  }

  async createWorkSchedule(req: AuthRequest, res: Response) {
    try {
      const dto = CreateWorkScheduleSchema.parse(req.body);
      const userId = req.user?.id;
      if (!userId || !(await verifyLawyer(userId))) {
        return res.status(HttpStatusCodes.UNAUTHORIZED.code).json(
          buildHttpResponse(HttpStatusCodes.UNAUTHORIZED.code, MESSAGES.CALENDAR.CALENDAR_ERROR_ACCESS_DENIED, req.path)
        );
      }
      const created = await service.createSchedule(userId, dto);
      return res.status(HttpStatusCodes.CREATED.code).json(
        buildHttpResponse(HttpStatusCodes.CREATED.code, MESSAGES.CALENDAR.CALENDAR_SUCCESS_CREATED, req.path, created)
      );
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(HttpStatusCodes.BAD_REQUEST.code).json(
          buildHttpResponse(HttpStatusCodes.BAD_REQUEST.code, MESSAGES.CALENDAR.CALENDAR_ERROR_CREATING, req.path, e)
        );
      }
      return internal(res, req.path);
    }
  }

  async getWorkScheduleById(req: ExpressRequest, res: Response) {
    try {
      const schedule = await service.getSchedule(Number(req.params.schedule_id));
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(HttpStatusCodes.OK.code, MESSAGES.CALENDAR.CALENDAR_SUCCESS_RETRIEVED, req.path, schedule)
      );
    } catch {
      return internal(res, req.path);
    }
  }

  async listSchedulesByLawyer(req: ExpressRequest, res: Response) {
    try {
      const schedules = await service.listSchedulesByLawyer(Number(req.params.lawyer_id));
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(HttpStatusCodes.OK.code, MESSAGES.CALENDAR.CALENDAR_SUCCESS_LIST_RETRIEVED, req.path, schedules)
      );
    } catch {
      return internal(res, req.path);
    }
  }

  async updateWorkSchedule(req: AuthRequest, res: Response) {
    try {
      const dto = UpdateWorkScheduleSchema.parse(req.body);
      const userId = req.user?.id;
      if (!userId) {
        return res.status(HttpStatusCodes.UNAUTHORIZED.code).json(
          buildHttpResponse(HttpStatusCodes.UNAUTHORIZED.code, MESSAGES.CALENDAR.CALENDAR_ERROR_ACCESS_DENIED, req.path)
        );
      }
      const updated = await service.updateSchedule(Number(req.params.schedule_id), dto, userId);
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(HttpStatusCodes.OK.code, MESSAGES.CALENDAR.CALENDAR_SUCCESS_UPDATED, req.path, updated)
      );
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(HttpStatusCodes.BAD_REQUEST.code).json(
          buildHttpResponse(HttpStatusCodes.BAD_REQUEST.code, MESSAGES.CALENDAR.CALENDAR_ERROR_UPDATING, req.path, e)
        );
      }
      return internal(res, req.path);
    }
  }

  async deleteWorkSchedule(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(HttpStatusCodes.UNAUTHORIZED.code).json(
          buildHttpResponse(HttpStatusCodes.UNAUTHORIZED.code, MESSAGES.CALENDAR.CALENDAR_ERROR_ACCESS_DENIED, req.path)
        );
      }
      await service.deleteSchedule(Number(req.params.schedule_id), userId);
      return res.status(HttpStatusCodes.NO_CONTENT.code).send();
    } catch {
      return internal(res, req.path);
    }
  }
}
