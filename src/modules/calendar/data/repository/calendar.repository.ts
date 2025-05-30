import { PrismaClient } from "@prisma/client"
import { CreateEventDto } from "../../domain/dtos/create_event.dto"
import { UpdateEventDto } from "../../domain/dtos/update_event.dto"
import { CreateWorkScheduleDto } from "../../domain/dtos/create_work_schedule.dto"
import { UpdateWorkScheduleDto } from "../../domain/dtos/update_work_schedule.dto"
import { EventEntity, WorkScheduleEntity } from "../../domain/entities/calendar.entity"

const prisma = new PrismaClient()

function toTimeDate(timeStr: string): Date {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date(0);
  date.setUTCHours(hours, minutes, 0, 0);
  return date;
}

function toDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
}

function formatTime(time: Date): string {
  return time.toISOString().substring(11, 16)
}

export class CalendarRepository {
  async createEvent(userId: number, dto: CreateEventDto): Promise<EventEntity> {
    const created = await prisma.events.create({
      data: {
        lawyer_id: userId,
        title: dto.title,
        description: dto.description,
        start_time: toTimeDate(dto.start_time),
        end_time: toTimeDate(dto.end_time),
        dates: {
          create: dto.dates.map((date: string) => ({ date: toDate(date) }))
        }
      },
      include: { dates: true }
    })

    return {
      id: created.id,
      title: created.title,
      description: created.description || "",
      dates: created.dates.map((d: {date: Date}) => d.date.toISOString().split("T")[0]),
      start_time: formatTime(created.start_time),
      end_time: formatTime(created.end_time)
    }
  }

  async getEvent(id: number): Promise<EventEntity | null> {
    const found = await prisma.events.findUnique({
      where: { id },
      include: { dates: true }
    })

    if (!found) return null

    return {
      id: found.id,
      title: found.title,
      description: found.description || "",
      dates: found.dates.map((d: {date: Date}) => d.date.toISOString().split("T")[0]),
      start_time: formatTime(found.start_time),
      end_time: formatTime(found.end_time)
    }
  }

  async listEventsByLawyer(lawyer_id: number): Promise<EventEntity[]> {
    const list = await prisma.events.findMany({
      where: { lawyer_id },
      include: { dates: true }
    })

    return list.map(e => ({
      id: e.id,
      title: e.title,
      description: e.description || "",
      dates: e.dates.map((d: {date: Date}) => d.date.toISOString().split("T")[0]),
      start_time: formatTime(e.start_time),
      end_time: formatTime(e.end_time)
    }))
  }

  async updateEvent(id: number, dto: UpdateEventDto, userId: number): Promise<EventEntity | null> {
    const found = await prisma.events.findUnique({ where: { id } })
    if (!found || found.lawyer_id !== userId) return null

    if (dto.dates) {
      await prisma.eventDates.deleteMany({ where: { event_id: id } })
    }

    const updated = await prisma.events.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        start_time: dto.start_time ? toTimeDate(dto.start_time) : undefined,
        end_time: dto.end_time ? toTimeDate(dto.end_time) : undefined,
        dates: dto.dates ? {
          deleteMany: {},
          create: dto.dates.map((date: string) => ({ date: toDate(date) }))
        } : undefined,
      },
      include: { dates: true }
    })

    return {
      id: updated.id,
      title: updated.title,
      description: updated.description || "",
      dates: updated.dates.map((d: {date: Date}) => d.date.toISOString().split("T")[0]),
      start_time: formatTime(updated.start_time),
      end_time: formatTime(updated.end_time)
    }
  }

  async deleteEvent(id: number, userId: number): Promise<boolean> {
    const found = await prisma.events.findUnique({ where: { id } })
    if (!found || found.lawyer_id !== userId) return false
    await prisma.events.delete({ where: { id } })
    return true
  }

  async createSchedule(userId: number, dto: CreateWorkScheduleDto): Promise<WorkScheduleEntity> {
    const created = await prisma.workSchedules.create({
      data: {
        lawyer_id: userId,
        day: dto.day,
        open_time: toTimeDate(dto.open_time),
        close_time: toTimeDate(dto.close_time)
      }
    })
    return {
      id: created.id,
      day: created.day,
      open_time: formatTime(created.open_time),
      close_time: formatTime(created.close_time)
    }
  }

  async getSchedule(id: number): Promise<WorkScheduleEntity | null> {
    const found = await prisma.workSchedules.findUnique({ where: { id } })
    if (!found) return null
    return {
      id: found.id,
      day: found.day,
      open_time: formatTime(found.open_time),
      close_time: formatTime(found.close_time)
    }
  }

  async listSchedulesByLawyer(lawyer_id: number): Promise<WorkScheduleEntity[]> {
    const list = await prisma.workSchedules.findMany({ where: { lawyer_id } })
    return list.map(ws => ({
      id: ws.id,
      day: ws.day,
      open_time: formatTime(ws.open_time),
      close_time: formatTime(ws.close_time)
    }))
  }

  async updateSchedule(id: number, dto: UpdateWorkScheduleDto, userId: number): Promise<WorkScheduleEntity | null> {
    const found = await prisma.workSchedules.findUnique({ where: { id } })
    if (!found || found.lawyer_id !== userId) return null

    const updated = await prisma.workSchedules.update({
      where: { id },
      data: {
        day: dto.day,
        open_time: dto.open_time ? toTimeDate(dto.open_time) : undefined,
        close_time: dto.close_time ? toTimeDate(dto.close_time) : undefined
      }
    })

    return {
      id: updated.id,
      day: updated.day,
      open_time: formatTime(updated.open_time),
      close_time: formatTime(updated.close_time)
    }
  }

  async deleteSchedule(id: number, userId: number): Promise<boolean> {
    const found = await prisma.workSchedules.findUnique({ where: { id } })
    if (!found || found.lawyer_id !== userId) return false
    await prisma.workSchedules.delete({ where: { id } })
    return true
  }

  async listEventsPaginated(lawyer_id: number, skip: number, take: number) {
  const list = await prisma.events.findMany({
    where: { lawyer_id },
    skip,
    take,
    include: { dates: true }
  });
  return list.map(e => ({
    id: e.id,
    title: e.title,
    description: e.description || "",
    dates: e.dates.map(d => d.date.toISOString().split("T")[0]),
    start_time: formatTime(e.start_time),
    end_time: formatTime(e.end_time)
  }));
}

async countEvents(lawyer_id: number) {
  return prisma.events.count({ where: { lawyer_id } });
}

  async listSchedulesPaginated(lawyer_id: number, skip: number, take: number) {
    const list = await prisma.workSchedules.findMany({
      where: { lawyer_id },
      skip,
      take
    });
    return list.map(ws => ({
      id: ws.id,
      day: ws.day,
      open_time: formatTime(ws.open_time),
      close_time: formatTime(ws.close_time)
    }));
  }

  async countSchedules(lawyer_id: number) {
    return prisma.workSchedules.count({ where: { lawyer_id } });
  }
}
