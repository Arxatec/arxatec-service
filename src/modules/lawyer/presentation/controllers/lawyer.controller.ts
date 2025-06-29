import { Request, Response } from "express";
import { LawyerService } from "../services/lawyer.service";
import { UpdateLawyerSchema } from "../../domain/dtos/update_lawyer.dto";
import { RegisterLawyerSchema } from "../../domain/dtos/register_lawyer.dto";
import { ZodError } from "zod";
import { HttpStatusCodes } from "../../../../constants/http_status_codes";
import { buildHttpResponse } from "../../../../utils/build_http_response";
import {
  handleZodError,
  handleServerError,
} from "../../../../utils/error_handler";
import { MESSAGES } from "../../../../constants/messages";
import { LawyerRepository } from "../../data/repository/lawyer.repository";
import { Pagination } from "../../../../utils/pagination";
import { AppError } from "../../../../utils/errors";

const lawyerRepository = new LawyerRepository();
const lawyerService = new LawyerService(lawyerRepository);

interface AuthenticatedRequest extends Request {
  user?: { id: number; user_type: "admin" | "client" | "lawyer" };
}

interface LawyerRequest {
  files?: {
    photo?: Express.Multer.File[];
    [fieldname: string]: Express.Multer.File[] | undefined;
  };
  body: any;
}

export class LawyerController {
  async getLawyerById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const lawyer = await lawyerService.getLawyerById(Number(id));
      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            MESSAGES.LAWYER.LAWYER_SUCCESS_RETRIEVED,
            `/lawyers/${id}`,
            lawyer
          )
        );
    } catch (error) {
      console.error("Error in getLawyerById controller:", error);
      return handleServerError(res, req, error);
    }
  }

  async getAllLawyers(req: Request, res: Response): Promise<Response> {
    try {
      const { page, limit, skip } = Pagination.getPaginationParams(req.query);
      const { data, meta } = await lawyerService.getAllLawyersPaginated(
        page,
        limit,
        skip
      );

      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            MESSAGES.LAWYER.LAWYER_SUCCESS_LIST_RETRIEVED,
            "/lawyers",
            data,
            meta
          )
        );
    } catch (error) {
      console.error("Error in getAllLawyers controller:", error);
      return handleServerError(res, req, error);
    }
  }

  async getLawyerProfile(req: Request, res: Response): Promise<Response> {
    try {
      const authReq = req as AuthenticatedRequest;
      if (!authReq.user) {
        return res
          .status(HttpStatusCodes.UNAUTHORIZED.code)
          .json(
            buildHttpResponse(
              HttpStatusCodes.UNAUTHORIZED.code,
              "Unauthorized",
              "/lawyers/profile",
              null
            )
          );
      }
      const lawyer = await lawyerService.getLawyerProfile(authReq.user.id);
      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            MESSAGES.LAWYER.LAWYER_SUCCESS_RETRIEVED,
            "/lawyers/profile",
            lawyer
          )
        );
    } catch (error) {
      console.error("Error in getLawyerProfile controller:", error);
      return handleServerError(res, req, error);
    }
  }

  async updateLawyerProfile(req: Request, res: Response): Promise<Response> {
    try {
      const authReq = req as AuthenticatedRequest;
      const lawyerReq = req as LawyerRequest;

      if (!authReq.user) {
        return res
          .status(HttpStatusCodes.UNAUTHORIZED.code)
          .json(
            buildHttpResponse(
              HttpStatusCodes.UNAUTHORIZED.code,
              "Unauthorized",
              "/lawyers/profile",
              null
            )
          );
      }
      if (authReq.user.user_type !== "lawyer") {
        return res
          .status(HttpStatusCodes.FORBIDDEN.code)
          .json(
            buildHttpResponse(
              HttpStatusCodes.FORBIDDEN.code,
              "Access denied: not a lawyer",
              "/lawyers/profile",
              null
            )
          );
      }

      try {
        const photoFile = lawyerReq.files?.photo?.[0];
        const maxPhotoSizeBytes = 5 * 1024 * 1024; // 5 MB
        const allowedPhotoTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
        ];

        if (photoFile) {
          if (!allowedPhotoTypes.includes(photoFile.mimetype)) {
            throw new AppError(
              "File type for 'photo' not allowed. Only JPEG, PNG, GIF or WebP.",
              HttpStatusCodes.BAD_REQUEST.code
            );
          }

          if (photoFile.size > maxPhotoSizeBytes) {
            throw new AppError(
              `Photo file size exceeds the limit (${
                maxPhotoSizeBytes / 1024 / 1024
              }MB).`,
              HttpStatusCodes.BAD_REQUEST.code
            );
          }
        }

        const updateData = UpdateLawyerSchema.parse(req.body);
        const updated = await lawyerService.updateLawyerProfile(
          authReq.user.id,
          updateData,
          photoFile
        );
        return res
          .status(HttpStatusCodes.OK.code)
          .json(
            buildHttpResponse(
              HttpStatusCodes.OK.code,
              MESSAGES.LAWYER.LAWYER_SUCCESS_PROFILE_UPDATED,
              "/lawyers/profile",
              updated
            )
          );
      } catch (validationError) {
        console.error("Error validating update data:", validationError);
        if (validationError instanceof ZodError) {
          const zodResp = handleZodError(validationError, req);
          zodResp.path = "/lawyers/profile";
          return res.status(zodResp.status).json(zodResp);
        }
        throw validationError;
      }
    } catch (error) {
      console.error("Error in updateLawyerProfile controller:", error);
      return handleServerError(res, req, error);
    }
  }

  async registerLawyer(req: Request, res: Response): Promise<Response> {
    try {
      const lawyerReq = req as LawyerRequest;

      // Validación del archivo
      const photoFile = lawyerReq.files?.photo?.[0];
      const maxPhotoSizeBytes = 5 * 1024 * 1024; // 5 MB
      const allowedPhotoTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      if (!photoFile) {
        throw new AppError(
          "The 'photo' file is required.",
          HttpStatusCodes.BAD_REQUEST.code
        );
      }

      if (!allowedPhotoTypes.includes(photoFile.mimetype)) {
        throw new AppError(
          "File type for 'photo' not allowed. Only JPEG, PNG, GIF or WebP.",
          HttpStatusCodes.BAD_REQUEST.code
        );
      }

      if (photoFile.size > maxPhotoSizeBytes) {
        throw new AppError(
          `Photo file size exceeds the 5MB limit.`,
          HttpStatusCodes.BAD_REQUEST.code
        );
      }

      // Validación del cuerpo con Zod
      const data = RegisterLawyerSchema.parse(req.body);

      // Registro del abogado
      const lawyer = await lawyerService.registerLawyer(data, photoFile);

      return res.status(HttpStatusCodes.CREATED.code).json(
        buildHttpResponse(
          HttpStatusCodes.CREATED.code,
          MESSAGES.LAWYER.LAWYER_SUCCESS_REGISTERED,
          "/lawyers/register",
          lawyer
        )
      );
    } catch (error) {
      console.error("Error in registerLawyer controller:", error);

      // Si es error Zod, manejarlo separado
      if (error instanceof ZodError) {
        const zodResp = handleZodError(error, req);
        zodResp.path = "/lawyers/register";
        return res.status(zodResp.status).json(zodResp);
      }

      return handleServerError(res, req, error);
    }
  }
}
