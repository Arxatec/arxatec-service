import { CalendarRepository } from "../../data/repository/calendar.repository";
import { CreateEventDto } from "../../domain/dtos/create_event.dto";
import { UpdateEventDto } from "../../domain/dtos/update_event.dto";
import { CreateWorkScheduleDto } from "../../domain/dtos/create_work_schedule.dto";
import { UpdateWorkScheduleDto } from "../../domain/dtos/update_work_schedule.dto";
import { EventEntity, WorkScheduleEntity } from "../../domain/entities/calendar.entity";
import { MESSAGES } from "../../../../constants/messages";
import { Pagination } from "../../../../utils/pagination";

export class CalendarService {
  constructor(private calendarRepository = new CalendarRepository()) {}

  async createEvent(userId: number, dto: CreateEventDto): Promise<EventEntity> {
    return this.calendarRepository.createEvent(userId, dto);
  }

  async getEvent(id: number): Promise<EventEntity> {
    const event = await this.calendarRepository.getEvent(id);
    if (!event) throw new Error(MESSAGES.CALENDAR.CALENDAR_ERROR_NOT_FOUND);
    return event;
  }

  async listEventsByLawyer(lawyerId: number, page: number, limit: number, skip: number) {
    const [data, total] = await Promise.all([
      this.calendarRepository.listEventsPaginated(lawyerId, skip, limit),
      this.calendarRepository.countEvents(lawyerId)
    ]);
    return {
      data,
      meta: Pagination.buildPaginationMeta(total, page, limit)
    };
  }

  async updateEvent(id: number, dto: UpdateEventDto, userId: number): Promise<EventEntity> {
    const updated = await this.calendarRepository.updateEvent(id, dto, userId);
    if (!updated) throw new Error(MESSAGES.CALENDAR.CALENDAR_ERROR_NOT_FOUND);
    return updated;
  }

  async deleteEvent(id: number, userId: number): Promise<void> {
    const deleted = await this.calendarRepository.deleteEvent(id, userId);
    if (!deleted) throw new Error(MESSAGES.CALENDAR.CALENDAR_ERROR_NOT_FOUND);
  }

  async createSchedule(userId: number, dto: CreateWorkScheduleDto): Promise<WorkScheduleEntity> {
    return this.calendarRepository.createSchedule(userId, dto);
  }

  async getSchedule(id: number): Promise<WorkScheduleEntity> {
    const schedule = await this.calendarRepository.getSchedule(id);
    if (!schedule) throw new Error(MESSAGES.CALENDAR.CALENDAR_ERROR_NOT_FOUND);
    return schedule;
  }

  async listSchedulesByLawyer(lawyerId: number, page: number, limit: number, skip: number) {
    const [data, total] = await Promise.all([
      this.calendarRepository.listSchedulesPaginated(lawyerId, skip, limit),
      this.calendarRepository.countSchedules(lawyerId)
    ]);
    return {
      data,
      meta: Pagination.buildPaginationMeta(total, page, limit)
    };
  }

  async updateSchedule(id: number, dto: UpdateWorkScheduleDto, userId: number): Promise<WorkScheduleEntity> {
    const updated = await this.calendarRepository.updateSchedule(id, dto, userId);
    if (!updated) throw new Error(MESSAGES.CALENDAR.CALENDAR_ERROR_NOT_FOUND);
    return updated;
  }

  async deleteSchedule(id: number, userId: number): Promise<void> {
    const deleted = await this.calendarRepository.deleteSchedule(id, userId);
    if (!deleted) throw new Error(MESSAGES.CALENDAR.CALENDAR_ERROR_NOT_FOUND);
  }
}
