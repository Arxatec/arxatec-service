import { Request, Response } from "express";
import { LawyerService } from "../services/lawyer.service";
import { UpdateLawyerSchema } from "../../domain/dtos/update_lawyer.dto";
import { RegisterLawyerSchema } from "../../domain/dtos/register_lawyer.dto";
import { ZodError } from "zod";
import { HttpStatusCodes } from "../../../../constants/http_status_codes";
import { buildHttpResponse } from "../../../../utils/build_http_response";
import { handleZodError, handleServerError } from "../../../../utils/error_handler";
import { MESSAGES } from "../../../../constants/messages";
import { LawyerRepository } from "../../data/repository/lawyer.repository";

const lawyerRepository = new LawyerRepository();
const lawyerService = new LawyerService(lawyerRepository);

interface AuthenticatedRequest extends Request {
  user?: { id: number; user_type: "admin" | "client" | "lawyer" };
}

export class LawyerController {
  async getLawyerById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const lawyer = await lawyerService.getLawyerById(Number(id));
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          MESSAGES.LAWYER.LAWYER_SUCCESS_RETRIEVED,
          `/lawyers/${id}`,
          lawyer
        )
      );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }

  async getAllLawyers(_req: Request, res: Response): Promise<Response> {
    try {
      const lawyers = await lawyerService.getAllLawyers();
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          MESSAGES.LAWYER.LAWYER_SUCCESS_LIST_RETRIEVED,
          "/lawyers",
          lawyers
        )
      );
    } catch (error) {
      return handleServerError(res, _req, error);
    }
  }

  async getLawyerProfile(req: Request, res: Response): Promise<Response> {
    try {
      const authReq = req as AuthenticatedRequest;
      if (!authReq.user) {
        return res.status(HttpStatusCodes.UNAUTHORIZED.code).json(
          buildHttpResponse(
            HttpStatusCodes.UNAUTHORIZED.code,
            "Unauthorized",
            "/lawyers/profile",
            null
          )
        );
      }
      const lawyer = await lawyerService.getLawyerProfile(authReq.user.id);
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          MESSAGES.LAWYER.LAWYER_SUCCESS_RETRIEVED,
          "/lawyers/profile",
          lawyer
        )
      );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }

  async updateLawyerProfile(req: Request, res: Response): Promise<Response> {
    try {
      const authReq = req as AuthenticatedRequest;
      if (!authReq.user) {
        return res.status(HttpStatusCodes.UNAUTHORIZED.code).json(
          buildHttpResponse(
            HttpStatusCodes.UNAUTHORIZED.code,
            "Unauthorized",
            "/lawyers/profile",
            null
          )
        );
      }
      if (authReq.user.user_type !== "lawyer") {
        return res.status(HttpStatusCodes.FORBIDDEN.code).json(
          buildHttpResponse(
            HttpStatusCodes.FORBIDDEN.code,
            "Access denied: not a lawyer",
            "/lawyers/profile",
            null
          )
        );
      }
      const updateData = UpdateLawyerSchema.parse(req.body);
      const updated = await lawyerService.updateLawyerProfile(authReq.user.id, updateData);
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          MESSAGES.LAWYER.LAWYER_SUCCESS_PROFILE_UPDATED,
          "/lawyers/profile",
          updated
        )
      );
    } catch (error) {
      if (error instanceof ZodError) {
        const zodResp = handleZodError(error, req);
        zodResp.path = "/lawyers/profile";
        return res.status(zodResp.status).json(zodResp);
      }
      return handleServerError(res, req, error);
    }
  }

  async registerLawyer(req: Request, res: Response): Promise<Response> {
    try {
      const data = RegisterLawyerSchema.parse(req.body);
      const lawyer = await lawyerService.registerLawyer(
        Number(data.id),
        data.license_number,
        data.gender,
        data.birth_date,
        data.specialty,
        data.experience,
        data.biography,
        data.linkedin,
        data.preferred_client,
        data.payment_methods,
        data.currency,
        data.attorneyFees,
        data.workSchedules
      );
      return res.status(HttpStatusCodes.CREATED.code).json(
        buildHttpResponse(
          HttpStatusCodes.CREATED.code,
          MESSAGES.LAWYER.LAWYER_SUCCESS_REGISTERED,
          "/lawyers/register",
          lawyer
        )
      );
    } catch (error) {
      if (error instanceof ZodError) {
        const zodResp = handleZodError(error, req);
        zodResp.path = "/lawyers/register";
        return res.status(zodResp.status).json(zodResp);
      }
      return handleServerError(res, req, error);
    }
  }
}
