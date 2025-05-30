// src/modules/dashboard/lawyer/presentation/controllers/dashboardLawyer.controller.ts

import { Request as ExpressRequest, Response } from 'express';
import { DashboardLawyerService } from '../services/dashboardLawyer.service';
import { DashboardLawyerRepository } from '../../data/repository/dashboardLawyer.repository';
import { ZodError } from 'zod';
import { HttpStatusCodes } from '../../../../../constants/http_status_codes';
import { buildHttpResponse } from '../../../../../utils/build_http_response';
import { MESSAGES } from '../../../../../constants/messages';

interface AuthRequest extends ExpressRequest {
  user?: {
    id: number;
    email: string;
  };
}

export class DashboardLawyerController {
  private readonly service: DashboardLawyerService;

  constructor() {
    this.service = new DashboardLawyerService(
      new DashboardLawyerRepository()
    );
  }

  /* ───────────── SUMMARY KPIs, CASES, STATUES, CLIENT EXTERNAL───────────── */

  async getSummary(req: AuthRequest, res: Response) {
    try {
      const lawyerId = req.user?.id;
      if (!lawyerId) {
        throw new Error(MESSAGES.DASHBOARD.LAWYER.UNAUTHORIZED);
      }

      const data = await this.service.getSummary(lawyerId);
      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            MESSAGES.DASHBOARD.LAWYER.SUMMARY_SUCCESS,
            req.path,
            data
          )
        );
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
          );
      }
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.INTERNAL_SERVER_ERROR.code,
            (error as Error).message,
            req.path
          )
        );
    }
  }

  /* ───────────── CASE RECENT───────────── */

  async getRecent(req: AuthRequest, res: Response) {
    try {
      const lawyerId = req.user?.id;
      if (!lawyerId) {
        throw new Error(MESSAGES.DASHBOARD.LAWYER.UNAUTHORIZED);
      }

      const page = parseInt((req.query.page as string) ?? '1', 10);
      const limit = parseInt((req.query.limit as string) ?? '5', 10);

      const data = await this.service.getRecent(lawyerId, page, limit);
      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            MESSAGES.DASHBOARD.LAWYER.RECENT_SUCCESS,
            req.path,
            data
          )
        );
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
          );
      }
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.INTERNAL_SERVER_ERROR.code,
            (error as Error).message,
            req.path
          )
        );
    }
  }
  /* ───────────── CHANGES THE STATUES AND MESSAGES───────────── */

  async getActivity(req: AuthRequest, res: Response) {
    try {
      const lawyerId = req.user?.id;
      if (!lawyerId) {
        throw new Error(MESSAGES.DASHBOARD.LAWYER.UNAUTHORIZED);
      }

      const page = parseInt((req.query.page as string) ?? '1', 10);
      const limit = parseInt((req.query.limit as string) ?? '5', 10);

      const data = await this.service.getActivity(lawyerId, page, limit);
      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            MESSAGES.DASHBOARD.LAWYER.ACTIVITY_SUCCESS,
            req.path,
            data
          )
        );
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
          );
      }
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.INTERNAL_SERVER_ERROR.code,
            (error as Error).message,
            req.path
          )
        );
    }
  }
  /* ───────────── CASES COUNTS PER MOUNTH FOR N MONTHS───────────── */

  async getCasesPerMonth(req: AuthRequest, res: Response) {
    try {
      const lawyerId = req.user?.id;
      if (!lawyerId) {
        throw new Error(MESSAGES.DASHBOARD.LAWYER.UNAUTHORIZED);
      }

      const months = parseInt((req.query.months as string) ?? '5', 10);

      const data = await this.service.getCasesPerMonth(lawyerId, months);
      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            MESSAGES.DASHBOARD.LAWYER.CASES_PER_MONTH_SUCCESS,
            req.path,
            data
          )
        );
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
          );
      }
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.INTERNAL_SERVER_ERROR.code,
            (error as Error).message,
            req.path
          )
        );
    }
  }
}
