import { Router } from "express"
import { CalendarController } from "../controllers/calendar.controller"
import { authenticateToken } from "../../../../middlewares/authenticate_token"
import { asyncHandler } from "../../../../middlewares/async_handler"

const router = Router()
const controller = new CalendarController()

/**
 * @openapi
 * /api/v1/calendar/event:
 *   post:
 *     tags:
 *       - Calendar
 *     summary: Crear un nuevo evento
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEventDto'
 *     responses:
 *       201:
 *         description: Evento creado exitosamente

 * /api/v1/calendar/event/{event_id}:
 *   get:
 *     tags:
 *       - Calendar
 *     summary: Obtener un evento por ID
 *     parameters:
 *       - in: path
 *         name: event_id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Detalle del evento

 *   patch:
 *     tags:
 *       - Calendar
 *     summary: Actualizar un evento
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: event_id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEventDto'
 *     responses:
 *       200:
 *         description: Evento actualizado

 *   delete:
 *     tags:
 *       - Calendar
 *     summary: Eliminar un evento
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: event_id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Evento eliminado

 * /api/v1/calendar/event/lawyer/{lawyer_id}:
 *   get:
 *     tags:
 *       - Calendar
 *     summary: Listar eventos de un abogado
 *     parameters:
 *       - in: path
 *         name: lawyer_id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Lista de eventos

 * /api/v1/calendar/work_schedule:
 *   post:
 *     tags:
 *       - Calendar
 *     summary: Crear un nuevo horario de trabajo
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWorkScheduleDto'
 *     responses:
 *       201:
 *         description: Horario creado exitosamente

 * /api/v1/calendar/work_schedule/{schedule_id}:
 *   get:
 *     tags:
 *       - Calendar
 *     summary: Obtener horario por ID
 *     parameters:
 *       - in: path
 *         name: schedule_id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Detalle del horario

 *   patch:
 *     tags:
 *       - Calendar
 *     summary: Actualizar un horario de trabajo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schedule_id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateWorkScheduleDto'
 *     responses:
 *       200:
 *         description: Horario actualizado

 *   delete:
 *     tags:
 *       - Calendar
 *     summary: Eliminar un horario de trabajo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schedule_id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Horario eliminado

 * /api/v1/calendar/work_schedule/lawyer/{lawyer_id}:
 *   get:
 *     tags:
 *       - Calendar
 *     summary: Listar horarios de un abogado
 *     parameters:
 *       - in: path
 *         name: lawyer_id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Lista de horarios
 */

router.post("/event", authenticateToken, asyncHandler((req, res) => controller.createEvent(req, res)))
router.get("/event/:event_id", asyncHandler((req, res) => controller.getEventById(req, res)))
router.get("/event/lawyer/:lawyer_id", asyncHandler((req, res) => controller.listEventsByLawyer(req, res)))
router.patch("/event/:event_id", authenticateToken, asyncHandler((req, res) => controller.updateEvent(req, res)))
router.delete("/event/:event_id", authenticateToken, asyncHandler((req, res) => controller.deleteEvent(req, res)))

router.post("/work_schedule", authenticateToken, asyncHandler((req, res) => controller.createWorkSchedule(req, res)))
router.get("/work_schedule/:schedule_id", asyncHandler((req, res) => controller.getWorkScheduleById(req, res)))
router.get("/work_schedule/lawyer/:lawyer_id", asyncHandler((req, res) => controller.listSchedulesByLawyer(req, res)))
router.patch("/work_schedule/:schedule_id", authenticateToken, asyncHandler((req, res) => controller.updateWorkSchedule(req, res)))
router.delete("/work_schedule/:schedule_id", authenticateToken, asyncHandler((req, res) => controller.deleteWorkSchedule(req, res)))

export default router
