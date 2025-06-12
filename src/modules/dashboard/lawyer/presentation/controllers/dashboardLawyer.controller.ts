import { Request, Response } from "express";
import { ZodError } from "zod";
import { DashboardLawyerService } from "../services/dashboardLawyer.service";
import { DashboardLawyerRepository } from "../../data/repository/dashboardLawyer.repository";
import { HttpStatusCodes } from "../../../../../constants/http_status_codes";
import { buildHttpResponse } from "../../../../../utils/build_http_response";
import { MESSAGES } from "../../../../../constants/messages";

interface AuthRequest extends Request {
  user?: { id: number; email: string };
}

export class DashboardLawyerController {
  private readonly service = new DashboardLawyerService(
    new DashboardLawyerRepository(),
  );

  /* ───────────── SUMMARY ───────────── */
  getSummary = async (req: AuthRequest, res: Response) => {
    try {
      const lawyerId = req.user?.id;
      if (!lawyerId) throw new Error(MESSAGES.DASHBOARD.LAWYER.UNAUTHORIZED);

      const data = await this.service.getSummary(lawyerId);
      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            MESSAGES.DASHBOARD.LAWYER.SUMMARY_SUCCESS,
            req.path,
            data,
          ),
        );
    } catch (err) {
      return this.handleError(err, req, res);
    }
  };

  /* ───────────── PRIVATE ───────────── */
  private handleError(err: unknown, req: Request, res: Response) {
    if (err instanceof ZodError) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.BAD_REQUEST.code,
            err.message,
            req.path,
          ),
        );
    }
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR.code)
      .json(
        buildHttpResponse(
          HttpStatusCodes.INTERNAL_SERVER_ERROR.code,
          (err as Error).message,
          req.path,
        ),
      );
  }
}
