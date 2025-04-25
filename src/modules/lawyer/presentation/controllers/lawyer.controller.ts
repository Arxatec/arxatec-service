import { Request, Response } from "express";
import { LawyerService } from "../services/lawyer.service";
import { UpdateLawyerSchema } from "../../domain/dtos/update_lawyer.dto";
import { RegisterLawyerSchema } from "../../domain/dtos/register_lawyer.dto";
import { HttpStatusCodes } from "../../../../constants/http_status_codes";
import { buildHttpResponse } from "../../../../utils/build_http_response";
import { handleServerError } from "../../../../utils/error_handler";
import { MESSAGES } from "../../../../constants/messages";
import { LawyerRepository } from "../../data/repository/lawyer.repository";
import { AppError } from "../../../../utils/errors";

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
      
      if (!lawyer) {
        throw new AppError(MESSAGES.LAWYER.LAWYER_ERROR_NOT_FOUND, HttpStatusCodes.NOT_FOUND.code);
      }

      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          MESSAGES.LAWYER.LAWYER_SUCCESS_RETRIEVED,
          req.path,
          lawyer
        )
      );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }

  async getAllLawyers(req: Request, res: Response): Promise<Response> {
    try {
      const lawyers = await lawyerService.getAllLawyers();
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          MESSAGES.LAWYER.LAWYER_SUCCESS_LIST_RETRIEVED,
          req.path,
          lawyers
        )
      );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }

  async getLawyerProfile(req: Request, res: Response): Promise<Response> {
    try {
      const authReq = req as AuthenticatedRequest;
      if (!authReq.user) {
        throw new AppError("Unauthorized", HttpStatusCodes.UNAUTHORIZED.code);
      }

      const lawyer = await lawyerService.getLawyerProfile(authReq.user.id);
      if (!lawyer) {
        throw new AppError(MESSAGES.LAWYER.LAWYER_ERROR_NOT_FOUND, HttpStatusCodes.NOT_FOUND.code);
      }

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
        throw new AppError("Unauthorized", HttpStatusCodes.UNAUTHORIZED.code);
      }

      if (authReq.user.user_type !== "lawyer") {
        throw new AppError(MESSAGES.LAWYER.LAWYER_ERROR_ACCESS_DENIED, HttpStatusCodes.FORBIDDEN.code);
      }

      const updateData = UpdateLawyerSchema.parse(req.body);
      const updated = await lawyerService.updateLawyerProfile(authReq.user.id, updateData);
      
      if (!updated) {
        throw new AppError(MESSAGES.LAWYER.LAWYER_ERROR_NOT_FOUND, HttpStatusCodes.NOT_FOUND.code);
      }

      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          MESSAGES.LAWYER.LAWYER_SUCCESS_PROFILE_UPDATED,
          req.path,
          updated
        )
      );
    } catch (error) {
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

      if (!lawyer) {
        throw new AppError(MESSAGES.LAWYER.LAWYER_ERROR_REGISTERING, HttpStatusCodes.BAD_REQUEST.code);
      }

      return res.status(HttpStatusCodes.CREATED.code).json(
        buildHttpResponse(
          HttpStatusCodes.CREATED.code,
          MESSAGES.LAWYER.LAWYER_SUCCESS_REGISTERED,
          req.path,
          lawyer
        )
      );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }
}
