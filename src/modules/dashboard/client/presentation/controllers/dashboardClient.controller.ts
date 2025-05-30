// src/modules/dashboard/client/presentation/controllers/dashboardClient.controller.ts

import { Request as ExpressRequest, Response } from 'express'
import { DashboardClientService } from '../services/dashboardClient.service'
import { DashboardClientRepository } from '../../data/repository/dashboardClient.repository'
import { ZodError } from 'zod'
import { HttpStatusCodes } from '../../../../../constants/http_status_codes'
import { buildHttpResponse } from '../../../../../utils/build_http_response'
import { MESSAGES } from '../../../../../constants/messages'

interface AuthRequest extends ExpressRequest {
  user?: {
    id: number
    email: string
  }
}

export class DashboardClientController {
  private readonly service: DashboardClientService

  constructor() {
    this.service = new DashboardClientService(
      new DashboardClientRepository()
    )
  }

  /* ───────────── SUMMARY KPIs & RECENT CASES ───────────── */
  async getSummary(req: AuthRequest, res: Response) {
    try {
      const clientId = req.user?.id
      if (!clientId) {
        throw new Error(MESSAGES.DASHBOARD.CLIENT.UNAUTHORIZED)
      }

      const data = await this.service.getSummary(clientId)
      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            MESSAGES.DASHBOARD.CLIENT.SUMMARY_SUCCESS,
            req.path,
            data
          )
        )
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(HttpStatusCodes.BAD_REQUEST.code)
          .json(
            buildHttpResponse(
              HttpStatusCodes.BAD_REQUEST.code,
              error.message,
              req.path
            )
          )
      }
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.INTERNAL_SERVER_ERROR.code,
            (error as Error).message,
            req.path
          )
        )
    }
  }

  /* ───────────── RECENT CASES (PAGINATED) ───────────── */
  async getRecent(req: AuthRequest, res: Response) {
    try {
      const clientId = req.user?.id
      if (!clientId) {
        throw new Error(MESSAGES.DASHBOARD.CLIENT.UNAUTHORIZED)
      }

      const page = parseInt((req.query.page as string) ?? '1', 10)
      const limit = parseInt((req.query.limit as string) ?? '5', 10)

      const data = await this.service.getRecent(clientId, page, limit)
      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            MESSAGES.DASHBOARD.CLIENT.RECENT_SUCCESS,
            req.path,
            data
          )
        )
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(HttpStatusCodes.BAD_REQUEST.code)
          .json(
            buildHttpResponse(
              HttpStatusCodes.BAD_REQUEST.code,
              error.message,
              req.path
            )
          )
      }
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.INTERNAL_SERVER_ERROR.code,
            (error as Error).message,
            req.path
          )
        )
    }
  }

  /* ───────────── ACTIVITY (PAGINATED) ───────────── */
  async getActivity(req: AuthRequest, res: Response) {
    try {
      const clientId = req.user?.id
      if (!clientId) {
        throw new Error(MESSAGES.DASHBOARD.CLIENT.UNAUTHORIZED)
      }

      const page = parseInt((req.query.page as string) ?? '1', 10)
      const limit = parseInt((req.query.limit as string) ?? '5', 10)

      const data = await this.service.getActivity(clientId, page, limit)
      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            MESSAGES.DASHBOARD.CLIENT.ACTIVITY_SUCCESS,
            req.path,
            data
          )
        )
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(HttpStatusCodes.BAD_REQUEST.code)
          .json(
            buildHttpResponse(
              HttpStatusCodes.BAD_REQUEST.code,
              error.message,
              req.path
            )
          )
      }
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.INTERNAL_SERVER_ERROR.code,
            (error as Error).message,
            req.path
          )
        )
    }
  }

  /* ───────────── CASES PER MONTH ───────────── */
  async getCasesPerMonth(req: AuthRequest, res: Response) {
    try {
      const clientId = req.user?.id
      if (!clientId) {
        throw new Error(MESSAGES.DASHBOARD.CLIENT.UNAUTHORIZED)
      }

      const months = parseInt((req.query.months as string) ?? '5', 10)

      const data = await this.service.getCasesPerMonth(clientId, months)
      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            MESSAGES.DASHBOARD.CLIENT.CASES_PER_MONTH_SUCCESS,
            req.path,
            data
          )
        )
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(HttpStatusCodes.BAD_REQUEST.code)
          .json(
            buildHttpResponse(
              HttpStatusCodes.BAD_REQUEST.code,
              error.message,
              req.path
            )
          )
      }
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.INTERNAL_SERVER_ERROR.code,
            (error as Error).message,
            req.path
          )
        )
    }
  }
}
